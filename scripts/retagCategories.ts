/**
 * retagCategories.ts
 * Lomar Space — mahsulotlarni nomiga qarab (nemischa + inglizcha kalit
 * so'zlar bilan) to'g'ri kategoriyaga (category_id) qayta belgilash.
 *
 * Muammo: import paytida ko'p mahsulotlar category_id = NULL bo'lib
 * qolgan, yoki barchasi umumiy "Furniture" qutisiga tashlangan —
 * shuning uchun "Lamp", "Chair" kabi aniq kategoriya filtrlari deyarli
 * bo'sh natija berayapti.
 *
 * ISHLATISH:
 *   npx tsx retagCategories.ts            (dry run — hech narsa yozilmaydi)
 *   npx tsx retagCategories.ts --apply    (haqiqatan Supabase'ga yozadi)
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

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
const isApplyMode = process.argv.includes("--apply");
const PAGE_SIZE = 1000;

// ------------------------------------------------------------------
// Kategoriya nomi -> kalit so'zlar (nemischa + inglizcha).
// Tartib MUHIM: yuqoridagilar avval tekshiriladi, birinchi mos kelgani
// tanlanadi (masalan "Eckcouch" so'zi ham "sofa" ham "corner" so'ziga
// mos kelishi mumkin bo'lgani uchun eng aniq so'zlarni yuqoriga qo'ying).
// ------------------------------------------------------------------
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  sofa: [
    "sofa",
    "couch",
    "ecksofa",
    "eckcouch",
    "schlafsofa",
    "ottomane",
    "chaiselongue",
  ],
  chair: [
    "chair",
    "stuhl",
    "stühle",
    "stuehle",
    "sessel",
    "hocker",
    "armchair",
    "esszimmerstuhl",
    "bürostuhl",
    "buerostuhl",
    "gaming chair",
    "gamingstuhl",
  ],
  table: [
    "table",
    "tisch",
    "tische",
    "esstisch",
    "couchtisch",
    "beistelltisch",
    "schreibtisch",
    "nachttisch",
  ],
  bed: [
    "bed frame",
    "bett",
    "betten",
    "bettgestell",
    "matratze",
    "mattress",
    "boxspring",
  ],
  wardrobe: [
    "wardrobe",
    "kleiderschrank",
    "schrank",
    "schränke",
    "schraenke",
    "closet",
    "garderobe",
  ],
  shelf: [
    "shelf",
    "shelves",
    "shelving",
    "bookcase",
    "regal",
    "regale",
    "bücherregal",
    "buecherregal",
    "wandregal",
  ],
  desk: ["desk", "schreibtisch", "arbeitstisch"],
  lamp: [
    "lamp",
    "lampe",
    "lampen",
    "leuchte",
    "leuchten",
    "stehlampe",
    "deckenleuchte",
    "wandleuchte",
    "tischlampe",
  ],
  mirror: ["mirror", "spiegel"],
  rug: ["rug", "teppich", "teppiche", "carpet"],
  decor: [
    "decor",
    "décor",
    "deko",
    "dekoration",
    "vase",
    "kerze",
    "candle",
    "curtain",
    "vorhang",
    "gardine",
    "kissen",
    "cushion",
    "pillow",
    "throw",
    "blanket",
    "decke",
    "plant",
    "pflanze",
    "wall art",
    "wandbild",
  ],
};

async function fetchAllCategories() {
  const { data, error } = await supabase.from("categories").select("id, name");
  if (error) {
    console.error("Kategoriyalarni o'qishda xato:", error.message);
    process.exit(1);
  }
  return data ?? [];
}

async function fetchAllFurniture() {
  let allRows: any[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("furniture")
      .select("id, name, description, category_id")
      .range(from, to);

    if (error) {
      console.error("Mahsulotlarni o'qishda xato:", error.message);
      process.exit(1);
    }

    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    from += PAGE_SIZE;
    if (data.length < PAGE_SIZE) break;
  }

  return allRows;
}

function findCategoryInText(text: string): string | null {
  for (const [categoryName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (pattern.test(text)) {
        return categoryName;
      }
    }
  }
  return null;
}

/**
 * MUHIM: avval faqat MAHSULOT NOMIGA qaraymiz. Description matnlari
 * ko'pincha umumiy marketing shabloni bo'lib, boshqa mahsulot turlarini
 * ham tilga olishi mumkin (masalan "bizning stulimizga mos keladi" kabi),
 * bu esa aniq nom signalini (masalan "Beistelltisch" = stolcha) noto'g'ri
 * bosib ketishi mumkin edi. Shuning uchun description faqat NOM hech
 * narsaga mos kelmagandagina zaxira sifatida tekshiriladi.
 */
function detectCategory(name: string, description: string | null): string | null {
  const nameMatch = findCategoryInText(name.toLowerCase());
  if (nameMatch) return nameMatch;

  if (description) {
    return findCategoryInText(description.toLowerCase());
  }

  return null;
}

async function main() {
  console.log(`Rejim: ${isApplyMode ? "YOZISH (real)" : "DRY RUN (faqat ko'rish)"}\n`);

  const categories = await fetchAllCategories();
  const categoryIdByName = new Map<string, string>();
  categories.forEach((c) => categoryIdByName.set(c.name.toLowerCase(), c.id));

  const furnitureCategoryId = categoryIdByName.get("furniture"); // umumiy "Furniture" qutisi

  console.log("Mahsulotlar yuklanmoqda...");
  const rows = await fetchAllFurniture();
  console.log(`Jami ${rows.length} ta mahsulot topildi.\n`);

  // Faqat category_id bo'sh (NULL) YOKI umumiy "Furniture" qutisida
  // turgan mahsulotlarni qayta tekshiramiz. Allaqachon aniq kategoriyaga
  // (sofa, chair va h.k.) ega bo'lganlarga tegmaymiz.
  const candidateRows = rows.filter(
    (row) => !row.category_id || row.category_id === furnitureCategoryId
  );

  console.log(`Qayta tekshiriladigan mahsulotlar: ${candidateRows.length} ta\n`);

  const updates: { id: string; newCategoryId: string; detected: string; name: string }[] = [];
  let noMatchCount = 0;

  for (const row of candidateRows) {
    const detected = detectCategory(row.name, row.description);

    if (detected) {
      const newCategoryId = categoryIdByName.get(detected);
      if (newCategoryId && newCategoryId !== row.category_id) {
        updates.push({ id: row.id, newCategoryId, detected, name: row.name });
      }
    } else {
      noMatchCount++;
    }
  }

  console.log(`Aniq kategoriya topildi: ${updates.length} ta`);
  console.log(`Hech narsaga mos kelmadi (Furniture qutisida qoladi): ${noMatchCount} ta\n`);

  // Statistika: qaysi kategoriyaga nechta mahsulot ko'chiriladi
  const statByCategory: Record<string, number> = {};
  updates.forEach((u) => {
    statByCategory[u.detected] = (statByCategory[u.detected] ?? 0) + 1;
  });
  console.log("Kategoriya bo'yicha taqsimot:");
  Object.entries(statByCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count} ta`));

  console.log("\nNamuna (birinchi 20 ta o'zgarish):");
  updates.slice(0, 20).forEach((u, i) => {
    console.log(`${i + 1}. [${u.id}] ${u.name} -> ${u.detected}`);
  });

  if (!isApplyMode) {
    console.log(
      "\nBu DRY RUN edi — hech narsa yozilmadi. Haqiqatan yozish uchun:\n" +
        "  npx tsx retagCategories.ts --apply"
    );
    return;
  }

  console.log(`\n${updates.length} ta mahsulot yangilanmoqda...`);

  for (const update of updates) {
    const { error } = await supabase
      .from("furniture")
      .update({ category_id: update.newCategoryId })
      .eq("id", update.id);

    if (error) {
      console.error(`[${update.id}] yangilashda xato:`, error.message);
    }
  }

  console.log("\nQayta teglash tugadi.");
}

main();
