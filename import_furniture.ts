/**
 * Import filtered Awin furniture catalog into the existing Supabase `furniture` table.
 *
 * Run (dry run first, writes nothing, needs no env vars):
 *   npx tsx import_furniture.ts ./lomar_furniture_filtered.csv --dry
 * Real import:
 *   npx tsx import_furniture.ts ./lomar_furniture_filtered.csv
 *
 * Existing rows (same sku) are left untouched; only new products are inserted.
 */

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DRY_RUN = process.argv.includes("--dry");
const csvPath = process.argv.find((a) => a.endsWith(".csv"));
const SET_ACTIVE = true; // new products go live immediately; set false to review first
const BATCH_SIZE = 500;

if (!csvPath) {
  console.error("Usage: npx tsx import_furniture.ts <file.csv> [--dry]");
  process.exit(1);
}

type Row = Record<string, string>;

function toNumber(val: string | undefined): number | null {
  if (!val || val.trim() === "") return null;
  const n = parseFloat(val);
  return Number.isNaN(n) ? null : n;
}

function categoryName(row: Row): string {
  const second = row.merchant_product_second_category;
  const cat = row.merchant_category;
  const name = (row.product_name || "").toLowerCase();

  const bySecond: Record<string, string> = {
    "Stühle": "chair",
    "Tische": "table",
    "Kommoden & Regale": "shelf",
    "Betten": "bed",
    "Sofas": "sofa",
    "Sessel & Liegen": "chair",
  };
  if (second && bySecond[second]) return bySecond[second];

  const byCat: Record<string, string> = {
    "Tische": "table",
    "Tischfüße & Tischplatten": "table",
    "Stühle": "chair",
    "Barstühle": "chair",
    "Sitzbänke": "chair",
    "Hocker": "chair",
    "Sessel": "chair",
    "Sonnenliegen": "chair",
    "Regale": "shelf",
    "Sideboards": "shelf",
    "Schränke": "wardrobe",
  };
  if (cat && byCat[cat]) return byCat[cat];
  if (cat && /sofa/i.test(cat)) return "sofa";

  if (/wohnlandschaft|sofa|sitzer/.test(name)) return "sofa";
  if (/lattenrost|bett/.test(name)) return "bed";
  if (/regal/.test(name)) return "shelf";
  if (/konsole/.test(name)) return "table";
  if (/schrank/.test(name)) return "wardrobe";
  return "Furniture";
}

async function main() {
  const { data, errors } = Papa.parse<Row>(fs.readFileSync(csvPath!, "utf-8"), {
    header: true,
    skipEmptyLines: true,
  });
  if (errors.length) console.warn(`CSV parse warnings: ${errors.length}`, errors.slice(0, 3));

  // Build rows, de-duplicated by sku
  const bySku = new Map<string, { row: Row; sku: string; category: string }>();
  for (const row of data) {
    if (!row.merchant_id || !row.merchant_product_id || !row.product_name) continue;
    const sku = `${row.merchant_id}_${row.merchant_product_id}`;
    if (!bySku.has(sku)) bySku.set(sku, { row, sku, category: categoryName(row) });
  }
  const items = [...bySku.values()];
  console.log(`Parsed ${items.length} unique products from ${data.length} CSV rows.`);

  const catCounts: Record<string, number> = {};
  const brandCounts: Record<string, number> = {};
  for (const it of items) {
    catCounts[it.category] = (catCounts[it.category] || 0) + 1;
    brandCounts[it.row.merchant_name] = (brandCounts[it.row.merchant_name] || 0) + 1;
  }
  console.log("By category:", catCounts);
  console.log("By merchant (brand):", brandCounts);
  console.log("Sample sku:", items[0].sku, "|", items[0].row.product_name);

  if (DRY_RUN) {
    console.log("Dry run, nothing written.");
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
  const supabase = createClient(url, key);

  // Categories: must already exist
  const { data: cats, error: catErr } = await supabase.from("categories").select("id,name");
  if (catErr) throw new Error(`categories lookup failed: ${catErr.message}`);
  const catId = new Map((cats || []).map((c) => [c.name.toLowerCase(), c.id as string]));
  for (const name of Object.keys(catCounts)) {
    if (!catId.has(name.toLowerCase())) throw new Error(`Category "${name}" not found in categories table.`);
  }

  // Brands: look up by merchant name, create the missing ones
  const merchants = new Map<string, string>(); // name -> advertiser id
  for (const it of items) merchants.set(it.row.merchant_name, it.row.merchant_id);
  const { data: existingBrands, error: brandErr } = await supabase
    .from("brands")
    .select("id,name")
    .in("name", [...merchants.keys()]);
  if (brandErr) throw new Error(`brands lookup failed: ${brandErr.message}`);
  const brandId = new Map((existingBrands || []).map((b) => [b.name, b.id as string]));

  for (const [name, advertiserId] of merchants) {
    if (brandId.has(name)) continue;
    const { data: created, error } = await supabase
      .from("brands")
      .insert({ name, affiliate_network: "awin", affiliate_advertiser_id: String(advertiserId) })
      .select("id")
      .single();
    if (error) throw new Error(`Could not create brand "${name}": ${error.message}`);
    brandId.set(name, created.id);
    console.log(`Created brand: ${name}`);
  }

  const now = new Date().toISOString();
  const payload = items.map(({ row, sku, category }) => ({
    sku,
    name: row.product_name,
    description: row.description || null,
    price: toNumber(row.search_price),
    currency: row.currency || "EUR",
    image_url: row.aw_image_url || row.merchant_image_url || null,
    product_url: row.merchant_deep_link || null,
    affiliate_url: row.aw_deep_link || null,
    affiliate_network: "awin",
    brand_id: brandId.get(row.merchant_name)!,
    category_id: catId.get(category.toLowerCase())!,
    in_stock: row.in_stock === "1",
    is_active: SET_ACTIVE,
    render_ready: false,
    feed_last_synced_at: now,
    updated_at: now,
  }));

  let inserted = 0;
  let failedBatches = 0;
  for (let i = 0; i < payload.length; i += BATCH_SIZE) {
    const batch = payload.slice(i, i + BATCH_SIZE);
    const { data: res, error } = await supabase
      .from("furniture")
      .upsert(batch, { onConflict: "sku", ignoreDuplicates: true })
      .select("id");
    if (error) {
      failedBatches++;
      console.error(`Batch ${i / BATCH_SIZE + 1} failed: ${error.message}`);
      continue;
    }
    inserted += res?.length ?? 0;
    console.log(`Processed ${Math.min(i + BATCH_SIZE, payload.length)}/${payload.length}, new rows so far: ${inserted}`);
  }

  console.log(`Finished. New rows inserted: ${inserted}. Failed batches: ${failedBatches}.`);
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});