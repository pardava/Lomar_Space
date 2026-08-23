/**
 * productFilter.ts
 * Lomar Space — Awin datafeed uchun mahsulot filtri
 *
 * Maqsad: faqat mebel / uy dekor / bog' / oshxona-vanna uskunalariga oid
 * mahsulotlarni qoldirish, boshqa hamma narsani (asboblar, avtomobil
 * qismlari, elektronika va h.k.) chiqarib tashlash.
 *
 * Bu faylni import skriptingizga qo'shing va har bir mahsulotni
 * Supabase'ga yozishdan OLDIN isProductAllowed() orqali tekshiring.
 */

// ------------------------------------------------------------------
// 1) RUXSAT ETILGAN KATEGORIYALAR (Awin merchant_category maydoni)
//    Bu ro'yxatni o'zingizning datafeed'dagi haqiqiy kategoriya
//    nomlariga qarab moslashtiring — CSV'dagi merchantCategory ustunini
//    tekshirib chiqing.
// ------------------------------------------------------------------
const ALLOWED_CATEGORY_KEYWORDS: string[] = [
  "furniture",
  "sofa",
  "couch",
  "chair",
  "armchair",
  "table",
  "bed",
  "mattress",
  "wardrobe",
  "closet",
  "shelf",
  "shelves",
  "shelving",
  "bookcase",
  "cabinet",
  "desk",
  "storage",
  "decor",
  "décor",
  "decoration",
  "lighting",
  "lamp",
  "rug",
  "carpet",
  "curtain",
  "curtains",
  "cushion",
  "pillow",
  "blanket",
  "throw",
  "plant",
  "mirror",
  "kitchen",
  "dining",
  "bathroom",
  "outdoor",
  "garden",
  "patio",
  "wall art",
  "vase",
  "candle",
  "textile",
  "bedding",
  "home",
];

// ------------------------------------------------------------------
// 2) TAQIQLANGAN KALIT SO'ZLAR (mahsulot nomi/tavsifida bo'lsa — rad etish)
//    Bular sizning skrinshotingizdagi kabi mos kelmaydigan mahsulotlar
//    uchun himoya qatlami (kategoriya noto'g'ri belgilangan bo'lsa ham).
// ------------------------------------------------------------------
const BLOCKED_KEYWORDS: string[] = [
  "wrench",
  "ratchet",
  "socket set",
  "screwdriver",
  "drill",
  "power tool",
  "toolbox",
  "hardware kit",
  "winch",
  "reel",
  "fishing",
  "engine",
  "motor oil",
  "car part",
  "automotive",
  "tire",
  "brake pad",
  "spark plug",
  "battery charger",
  "welding",
  "generator",
  "chainsaw",
  "lawn mower",
  "smartphone",
  "laptop",
  "graphics card",
  "cpu",
  "gaming console",
  "headphone",
  "firearm",
  "ammunition",
];

// ------------------------------------------------------------------
// 3) YORDAMCHI FUNKSIYALAR
// ------------------------------------------------------------------

function normalize(text: string | undefined | null): string {
  return (text ?? "").toLowerCase().trim();
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * MUHIM: bu funksiya endi so'zlarni matn ichida "istalgan joyda" emas,
 * balki BUTUN SO'Z sifatida qidiradi (word-boundary \b bilan).
 * Aks holda masalan "engine" so'zi "engineered wood" (juda keng tarqalgan
 * mebel tavsifi!) ichida ham "topilib", noto'g'ri bloklab yuborardi.
 * Xuddi shunday "tire" so'zi "entire" ichida ham topilib ketardi.
 */
function containsAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => {
    const pattern = new RegExp(`\\b${escapeRegex(needle)}\\b`, "i");
    return pattern.test(haystack);
  });
}

/**
 * Mahsulot obyektining minimal shakli — o'zingizning Awin CSV/JSON
 * maydon nomlaringizga moslang (masalan merchantCategory, productName,
 * description, brandName va h.k.)
 */
export interface RawAwinProduct {
  productName: string;
  description?: string;
  merchantCategory?: string;
  categoryName?: string;
  brandName?: string;
}

/**
 * Asosiy filtr funksiyasi.
 * true  -> mahsulot Supabase'ga yozilishi mumkin
 * false -> mahsulot chiqarib tashlanadi (rad etiladi)
 */
export function isProductAllowed(product: RawAwinProduct): boolean {
  return checkProductAllowed(product).allowed;
}

/**
 * Debug versiyasi — nega mahsulot rad etilgani yoki qabul qilinganini
 * aniq ko'rsatadi (qaysi bloklangan so'z yoki kategoriya sabab bo'lgani).
 */
export function checkProductAllowed(product: RawAwinProduct): {
  allowed: boolean;
  reason: string;
} {
  const name = normalize(product.productName);
  const desc = normalize(product.description);
  const category = normalize(product.merchantCategory || product.categoryName);

  const combinedText = `${name} ${desc}`;

  // 1-qadam: agar kategoriya aniq ko'rsatilgan va u ruxsat etilgan
  // ro'yxatga mos kelsa — DARHOL qabul qilamiz. Description matnidagi
  // umumiy marketing shablonlari (masalan "laptop uchun ham qulay" kabi
  // iboralar mebel description'larida tez-tez uchraydi) mahsulotni
  // noto'g'ri bloklamasligi uchun bu yerda description tekshirilmaydi.
  const categoryMatches = containsAny(category, ALLOWED_CATEGORY_KEYWORDS);
  if (category && categoryMatches) {
    return { allowed: true, reason: "OK (kategoriya mos)" };
  }

  // 2-qadam: kategoriya bo'lmagan yoki mos kelmagan hollarda — faqat
  // MAHSULOT NOMIGA qarab bloklangan so'zlarni tekshiramiz (description
  // emas, chunki u shablonli va ishonchsiz).
  const blockedHit = BLOCKED_KEYWORDS.find((needle) => {
    const pattern = new RegExp(`\\b${escapeRegex(needle)}\\b`, "i");
    return pattern.test(name);
  });
  if (blockedHit) {
    return { allowed: false, reason: `BLOKLANGAN SO'Z (nomda): "${blockedHit}"` };
  }

  // 3-qadam: kategoriya mos kelmagan/bo'sh bo'lsa, nom+description
  // matnida ruxsat etilgan so'z bormi tekshiramiz (fallback)
  const nameMatches = containsAny(combinedText, ALLOWED_CATEGORY_KEYWORDS);
  if (nameMatches) {
    return { allowed: true, reason: "OK (nom mos)" };
  }

  return {
    allowed: false,
    reason: `KATEGORIYA/NOM MOS EMAS (kategoriya: "${category || "yo'q"}")`,
  };
}

/**
 * Import skriptingizda ishlatish namunasi:
 *
 * import { isProductAllowed } from "./productFilter";
 *
 * for (const rawProduct of parsedCsvRows) {
 *   if (!isProductAllowed(rawProduct)) {
 *     skippedCount++;
 *     continue;
 *   }
 *   // ... mavjud transform + Supabase insert logikangiz
 * }
 *
 * console.log(`${skippedCount} ta mahsulot filtr orqali chiqarib tashlandi`);
 */
