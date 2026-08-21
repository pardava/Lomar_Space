/**
 * scripts/import-awin-feed.ts
 *
 * Awin datafeed CSV'ni (bir nechta advertiser/brend aralash) o'qiydi,
 * faqat mebel/uy-dekoriga mos kategoriyalarni ajratib oladi,
 * brands/categories jadvallariga kerakli yozuvlarni yaratadi,
 * va Supabase `furniture` jadvaliga import qiladi.
 *
 * Haqiqiy `furniture` sxemasi (types/catalog.ts dan):
 *   id, name, description, price, original_price, currency, image_url,
 *   product_url, width_cm, depth_cm, height_cm, brand_id, category_id,
 *   style[], room_type[], sku, affiliate_url, affiliate_network,
 *   image_url_transparent, image_width_px, image_height_px, render_ready,
 *   last_render_check, in_stock, is_active, feed_last_synced_at,
 *   created_at, updated_at
 *
 * MUHIM: `furniture.sku` ustunida UNIQUE constraint bo'lishi kerak
 * (upsert onConflict shu ustunga tayanadi). Agar yo'q bo'lsa, Supabase
 * SQL Editor'da bir marta ishga tushiring:
 *   ALTER TABLE furniture ADD CONSTRAINT furniture_sku_unique UNIQUE (sku);
 *
 * ISHLATISH:
 *   npx tsx scripts/import-awin-feed.ts "scripts\awinfeed-3044593.csv" --dry-run
 *   npx tsx scripts/import-awin-feed.ts "scripts\awinfeed-3044593.csv"
 */

import "dotenv/config";
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

// ---------- CONFIG ----------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL yoki SUPABASE_SERVICE_ROLE_KEY .env.local da topilmadi."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BATCH_SIZE = 200;

const FURNITURE_CATEGORY_KEYWORDS = [
  "furniture",
  "home & garden",
  "home decor",
  "decor",
  "lighting",
  "tableware",
  "kitchen & dining",
  "bedding",
  "rugs",
  "curtains",
  "storage",
  "outdoor furniture",
];

const EXCLUDE_KEYWORDS = [
  "electronics",
  "mobile phone",
  "laptop",
  "computer",
  "clothing",
  "apparel",
  "shoes",
  "jewelry",
  "toy",
  "video game",
  "software",
];

// ---------- TYPES ----------

interface AwinRow {
  advertiser_id: string;
  advertiser_name: string;
  id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  aw_deep_link: string;
  google_product_category: string;
  product_type: string;
  brand: string;
  availability: string;
  price: string;
  [key: string]: string;
}

interface FurnitureInsertRow {
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  currency: string;
  image_url: string;
  product_url: string | null;
  width_cm: null;
  depth_cm: null;
  height_cm: null;
  brand_id: string | null;
  category_id: string | null;
  style: string[];
  room_type: string[];
  sku: string;
  affiliate_url: string | null;
  affiliate_network: string;
  image_url_transparent: null;
  image_width_px: null;
  image_height_px: null;
  render_ready: boolean;
  last_render_check: null;
  in_stock: boolean;
  is_active: boolean;
  feed_last_synced_at: string;
}

// ---------- HELPERS ----------

function isFurnitureRow(row: AwinRow): boolean {
  const cat = `${row.google_product_category || ""} ${row.product_type || ""}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some((kw) => cat.includes(kw))) return false;
  return FURNITURE_CATEGORY_KEYWORDS.some((kw) => cat.includes(kw));
}

function parsePrice(raw: string): { amount: number | null; currency: string } {
  if (!raw) return { amount: null, currency: "EUR" };
  const match = raw.trim().match(/^([\d.,]+)\s*([A-Z]{3})?$/);
  if (!match) return { amount: null, currency: "EUR" };
  const amount = parseFloat(match[1].replace(",", "."));
  const currency = match[2] || "EUR";
  return { amount: isNaN(amount) ? null : amount, currency };
}

function inferStyleAndRoom(row: AwinRow): { style: string[]; room_type: string[] } {
  const haystack = `${row.google_product_category} ${row.title} ${row.description}`.toLowerCase();

  const style: string[] = [];
  const styleKeywords: Record<string, string[]> = {
    boho: ["boho", "boheme", "orientalisch", "marokkanisch", "ethno"],
    scandinavian: ["skandinavisch", "scandi", "hygge"],
    modern: ["modern", "minimalist"],
  };
  for (const [key, words] of Object.entries(styleKeywords)) {
    if (words.some((w) => haystack.includes(w))) style.push(key);
  }
  if (style.length === 0) style.push("modern");

  const room_type: string[] = [];
  const roomKeywords: Record<string, string[]> = {
    living_room: ["wohnzimmer", "living room", "sofa", "couchtisch"],
    bedroom: ["schlafzimmer", "bedroom", "nachttisch", "bett"],
    kitchen: ["küche", "kitchen", "esszimmer", "dining"],
    bathroom: ["bad", "bathroom"],
    home_office: ["büro", "homeoffice", "office", "schreibtisch"],
    kids_room: ["kinderzimmer", "kids room"],
  };
  for (const [key, words] of Object.entries(roomKeywords)) {
    if (words.some((w) => haystack.includes(w))) room_type.push(key);
  }
  if (room_type.length === 0) room_type.push("living_room");

  return { style, room_type };
}

// Brend nomi -> brands.id keshi. Mavjud bo'lmasa yangi yozuv yaratadi.
async function getOrCreateBrandId(
  cache: Map<string, string>,
  name: string,
  advertiserId: string
): Promise<string | null> {
  if (!name) return null;
  if (cache.has(name)) return cache.get(name)!;

  const { data: existing, error: selectErr } = await supabase
    .from("brands")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (selectErr) {
    console.error(`   ⚠️ brands select xatosi (${name}):`, selectErr.message);
    return null;
  }

  if (existing) {
    cache.set(name, existing.id);
    return existing.id;
  }

  const { data: created, error: insertErr } = await supabase
    .from("brands")
    .insert({
      name,
      affiliate_network: "awin",
      affiliate_advertiser_id: advertiserId || null,
    })
    .select("id")
    .single();

  if (insertErr) {
    console.error(`   ⚠️ brands insert xatosi (${name}):`, insertErr.message);
    return null;
  }

  cache.set(name, created.id);
  return created.id;
}

// Kategoriya nomi (top-level) -> categories.id keshi.
async function getOrCreateCategoryId(
  cache: Map<string, string>,
  rawCategory: string
): Promise<string | null> {
  const name = (rawCategory || "").split(">")[0].trim();
  if (!name) return null;
  if (cache.has(name)) return cache.get(name)!;

  const { data: existing, error: selectErr } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (selectErr) {
    console.error(`   ⚠️ categories select xatosi (${name}):`, selectErr.message);
    return null;
  }

  if (existing) {
    cache.set(name, existing.id);
    return existing.id;
  }

  const { data: created, error: insertErr } = await supabase
    .from("categories")
    .insert({ name })
    .select("id")
    .single();

  if (insertErr) {
    console.error(`   ⚠️ categories insert xatosi (${name}):`, insertErr.message);
    return null;
  }

  cache.set(name, created.id);
  return created.id;
}

// ---------- MAIN ----------

async function main() {
  const csvPath = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");

  if (!csvPath) {
    console.error(
      '❌ Fayl path bering: npx tsx scripts/import-awin-feed.ts "C:\\path\\to\\file.csv" [--dry-run]'
    );
    process.exit(1);
  }

  const absPath = path.resolve(csvPath);
  if (!fs.existsSync(absPath)) {
    console.error(`❌ Fayl topilmadi: ${absPath}`);
    process.exit(1);
  }

  console.log(`📂 O'qilmoqda: ${absPath}`);
  const raw = fs.readFileSync(absPath, "utf-8");
  const cleanRaw = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;

  const records: AwinRow[] = parse(cleanRaw, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    bom: true,
  });

  console.log(`✅ ${records.length} ta qator topildi.\n`);

  const byBrand: Record<string, number> = {};
  for (const r of records) {
    const key = r.advertiser_name || "(noma'lum)";
    byBrand[key] = (byBrand[key] || 0) + 1;
  }
  console.log("📊 Brendlar bo'yicha (filtrlashdan oldin):");
  for (const [brand, count] of Object.entries(byBrand)) {
    console.log(`   - ${brand}: ${count}`);
  }

  const furnitureRecords = records.filter(
    (r) => r.title && r.id && r.image_link && isFurnitureRow(r)
  );
  console.log(`\n🪑 Filtrlashdan keyin (mebel/dekor + rasm mavjud): ${furnitureRecords.length} ta`);

  const byBrandFiltered: Record<string, number> = {};
  for (const r of furnitureRecords) {
    const key = r.advertiser_name || "(noma'lum)";
    byBrandFiltered[key] = (byBrandFiltered[key] || 0) + 1;
  }
  console.log("📊 Brendlar bo'yicha (filtrlashdan keyin):");
  for (const [brand, count] of Object.entries(byBrandFiltered)) {
    console.log(`   - ${brand}: ${count}`);
  }
  console.log("");

  if (dryRun) {
    const sample = furnitureRecords[0];
    const { amount, currency } = parsePrice(sample.price);
    const { style, room_type } = inferStyleAndRoom(sample);
    console.log("🧪 DRY RUN — Supabase'ga hech narsa yozilmadi, brand/category yaratilmadi.");
    console.log("Namuna (brand_id/category_id bu bosqichda hali aniqlanmagan):");
    console.log(
      JSON.stringify(
        {
          name: sample.title,
          price: amount,
          currency,
          image_url: sample.image_link,
          product_url: sample.link,
          affiliate_url: sample.aw_deep_link || sample.link,
          sku: `${sample.advertiser_id || sample.advertiser_name}_${sample.id}`,
          style,
          room_type,
          in_stock: sample.availability?.trim().toLowerCase() === "in_stock",
          brand_name_to_resolve: sample.advertiser_name,
          category_name_to_resolve: (sample.google_product_category || "").split(">")[0].trim(),
        },
        null,
        2
      )
    );
    return;
  }

  console.log("🏷️  Brend va kategoriyalarni tayyorlash...");
  const brandCache = new Map<string, string>();
  const categoryCache = new Map<string, string>();

  const uniqueBrands = new Map<string, string>(); // name -> advertiser_id
  const uniqueCategories = new Set<string>();
  for (const r of furnitureRecords) {
    if (r.advertiser_name) uniqueBrands.set(r.advertiser_name, r.advertiser_id);
    const top = (r.google_product_category || "").split(">")[0].trim();
    if (top) uniqueCategories.add(top);
  }

  for (const [name, advId] of uniqueBrands) {
    await getOrCreateBrandId(brandCache, name, advId);
  }
  console.log(`   ✅ ${brandCache.size} ta brend tayyor.`);

  for (const name of uniqueCategories) {
    await getOrCreateCategoryId(categoryCache, name);
  }
  console.log(`   ✅ ${categoryCache.size} ta kategoriya tayyor.\n`);

  const mapped: FurnitureInsertRow[] = furnitureRecords.map((row) => {
    const { amount, currency } = parsePrice(row.price);
    const { style, room_type } = inferStyleAndRoom(row);
    const advertiserKey = row.advertiser_id || row.advertiser_name || "unknown";
    const topCategory = (row.google_product_category || "").split(">")[0].trim();

    return {
      name: row.title,
      description: row.description || null,
      price: amount ?? 0,
      original_price: null,
      currency,
      image_url: row.image_link,
      product_url: row.link || null,
      width_cm: null,
      depth_cm: null,
      height_cm: null,
      brand_id: brandCache.get(row.advertiser_name) || null,
      category_id: categoryCache.get(topCategory) || null,
      style,
      room_type,
      sku: `${advertiserKey}_${row.id}`,
      affiliate_url: row.aw_deep_link || row.link || null,
      affiliate_network: "awin",
      image_url_transparent: null,
      image_width_px: null,
      image_height_px: null,
      render_ready: false,
      last_render_check: null,
      in_stock: row.availability?.trim().toLowerCase() === "in_stock",
      is_active: true,
      feed_last_synced_at: new Date().toISOString(),
    };
  });

  console.log(`🚀 Supabase'ga import boshlanmoqda (${mapped.length} ta, batch=${BATCH_SIZE})...`);

  let inserted = 0;
  for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
    const batch = mapped.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("furniture")
      .upsert(batch, { onConflict: "sku" });

    if (error) {
      console.error(`❌ Xato (batch ${i}-${i + batch.length}):`, error.message);
      continue;
    }
    inserted += batch.length;
    console.log(`   ✅ ${inserted}/${mapped.length} import qilindi...`);
  }

  console.log(`\n🎉 Tugadi. Jami ${inserted} ta mahsulot upsert qilindi.`);
}

main().catch((err) => {
  console.error("❌ Kutilmagan xato:", err);
  process.exit(1);
});