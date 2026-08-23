/**
 * cleanupBadProducts.ts
 * Lomar Space — Supabase'dagi "furniture" jadvalidan
 * mebel/dekorga aloqasi bo'lmagan mahsulotlarni topish va o'chirish.
 *
 * ISHLATISH (PowerShell):
 *   1) npm install @supabase/supabase-js dotenv
 *   2) .env faylida SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY borligiga ishonch hosil qiling
 *   3) Avval "dry run" rejimida ishga tushiring (hech narsa o'chirilmaydi):
 *        npx tsx cleanupBadProducts.ts
 *   4) Natijani ko'rib chiqqach, haqiqatan o'chirish uchun:
 *        npx tsx cleanupBadProducts.ts --delete
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { checkProductAllowed } from "./productFilter";

// Next.js loyihalarida o'zgaruvchilar odatda .env.local faylida saqlanadi,
// dotenv esa standart holda faqat .env faylini o'qiydi — shuning uchun
// yo'lni aniq ko'rsatamiz.
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "XATO: NEXT_PUBLIC_SUPABASE_URL yoki SUPABASE_SERVICE_ROLE_KEY .env.local faylida topilmadi."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const isDeleteMode = process.argv.includes("--delete");
const PAGE_SIZE = 1000;

// Supabase jadval va ustun nomlaringizga qarab moslang.
// "furniture" jadvalida kategoriya nomi emas, category_id (uuid) saqlanadi,
// haqiqiy nom "categories" jadvalida turadi — shuning uchun join qilamiz.
const TABLE_NAME = "furniture";
const NAME_COLUMN = "name";
const DESCRIPTION_COLUMN = "description";
const ID_COLUMN = "id";
const CATEGORIES_TABLE = "categories";
const CATEGORY_NAME_COLUMN = "name"; // categories jadvalidagi nom ustuni

async function fetchAllProducts() {
  let allRows: any[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `${ID_COLUMN}, ${NAME_COLUMN}, ${DESCRIPTION_COLUMN}, category_id, ${CATEGORIES_TABLE}(${CATEGORY_NAME_COLUMN})`
      )
      .range(from, to);

    if (error) {
      console.error("Supabase'dan o'qishda xato:", error.message);
      process.exit(1);
    }

    if (!data || data.length === 0) break;

    allRows = allRows.concat(data);
    from += PAGE_SIZE;

    if (data.length < PAGE_SIZE) break;
  }

  return allRows;
}

function getCategoryName(row: any): string {
  // Supabase join natijasi ba'zan object, ba'zan array shaklida qaytadi —
  // ikkalasini ham qo'llab-quvvatlaymiz.
  const cat = row[CATEGORIES_TABLE];
  if (!cat) return "";
  if (Array.isArray(cat)) return cat[0]?.[CATEGORY_NAME_COLUMN] ?? "";
  return cat[CATEGORY_NAME_COLUMN] ?? "";
}

async function main() {
  console.log(`Rejim: ${isDeleteMode ? "O'CHIRISH (real)" : "DRY RUN (faqat ko'rish)"}`);
  console.log("Supabase'dan mahsulotlar yuklanmoqda...");

  const rows = await fetchAllProducts();
  console.log(`Jami ${rows.length} ta mahsulot topildi.`);

  const checked = rows.map((row) => ({
    row,
    check: checkProductAllowed({
      productName: row[NAME_COLUMN],
      description: row[DESCRIPTION_COLUMN],
      merchantCategory: getCategoryName(row),
    }),
  }));

  const badRows = checked.filter((r) => !r.check.allowed).map((r) => r.row);
  const badChecks = checked.filter((r) => !r.check.allowed);

  console.log(`\nMos kelmaydigan mahsulotlar: ${badRows.length} ta\n`);

  // Namuna sifatida birinchi 20 tasini SABABI bilan ko'rsatamiz
  badChecks.slice(0, 20).forEach((r, i) => {
    console.log(
      `${i + 1}. [${r.row[ID_COLUMN]}] ${r.row[NAME_COLUMN]} — kategoriya: ${getCategoryName(r.row) || "yo'q"} — SABAB: ${r.check.reason}`
    );
  });

  if (badRows.length > 20) {
    console.log(`... va yana ${badRows.length - 20} ta.`);
  }

  // To'liq ro'yxatni CSV faylga yozamiz — Excel'da ko'rib chiqish uchun
  function toCsvValue(value: string): string {
    const escaped = (value ?? "").replace(/"/g, '""');
    return `"${escaped}"`;
  }

  const csvHeader = "id,name,category,reason\n";
  const csvBody = badChecks
    .map((r) =>
      [
        toCsvValue(r.row[ID_COLUMN]),
        toCsvValue(r.row[NAME_COLUMN]),
        toCsvValue(getCategoryName(r.row)),
        toCsvValue(r.check.reason),
      ].join(",")
    )
    .join("\n");

  const fs = await import("fs");
  const csvPath = "bad_products_review.csv";
  fs.writeFileSync(csvPath, csvHeader + csvBody, "utf-8");
  console.log(
    `\nTo'liq ro'yxat (${badChecks.length} ta) shu faylga yozildi: ${csvPath}\n` +
      "Excel'da ochib ko'rib chiqing. Agar noto'g'ri o'chirilishi kerak bo'lmagan\n" +
      "mebel/dekor mahsulotlarini ko'rsangiz, ayting — filtrni yana sozlaymiz."
  );

  if (!isDeleteMode) {
    console.log(
      "\nBu DRY RUN edi — hech narsa o'chirilmadi. Haqiqatan o'chirish uchun:\n" +
        "  npx tsx cleanupBadProducts.ts --delete"
    );
    return;
  }

  if (badRows.length === 0) {
    console.log("O'chirish uchun hech narsa yo'q.");
    return;
  }

  console.log(`\n${badRows.length} ta mahsulot o'chirilmoqda...`);

  const idsToDelete = badRows.map((row) => row[ID_COLUMN]);
  const CHUNK_SIZE = 500;

  for (let i = 0; i < idsToDelete.length; i += CHUNK_SIZE) {
    const chunk = idsToDelete.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase.from(TABLE_NAME).delete().in(ID_COLUMN, chunk);

    if (error) {
      console.error(`Chunk ${i}-${i + chunk.length} o'chirishda xato:`, error.message);
    } else {
      console.log(`  ${i + chunk.length} / ${idsToDelete.length} o'chirildi`);
    }
  }

  console.log("\nTozalash tugadi.");
}

main();
