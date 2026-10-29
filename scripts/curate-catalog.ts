// ============================================================
// Lomar Space — Katalogni 300-400 taga toza kuratsiya qilish
//
// G'oya: 3000+ chalkash yozuvni filtrlash o'rniga, har 4 style x
// 6 xona (24 kombinatsiya) uchun eng yaxshi ~17 tadan mahsulot
// tanlab, FAQAT ularni is_active=true qoldiramiz, qolganini
// is_active=false qilamiz. Bu — kod o'zgarishi talab qilmaydi,
// chunki barcha so'rovlar (getCatalogCandidates, getMatchedFurniture)
// allaqachon is_active=true filtrlaydi.
//
// Ishlatish:
//   npx tsx scripts/curate-catalog.ts --dry-run   (avval shu bilan)
//   npx tsx scripts/curate-catalog.ts             (haqiqiy o'zgarish)
//
// Xavfsiz: hech narsa o'chirilmaydi, faqat is_active flag o'zgaradi.
// Keyinchalik kerak bo'lsa, is_active=true qilib qaytarish mumkin.
// ============================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TARGET_TOTAL = 400;
const STYLES = ['scandinavian', 'modern', 'boho', 'minimalist'];
const ROOM_TYPES = ['living_room', 'bedroom', 'kitchen', 'home_office', 'kids_room', 'bathroom'];
const PER_COMBO_TARGET = Math.ceil(TARGET_TOTAL / (STYLES.length * ROOM_TYPES.length)); // ~17

const CORE_FURNITURE_CATEGORIES = [
  'bed', 'sofa', 'wardrobe', 'chair', 'table', 'desk', 'shelf', 'lamp', 'rug', 'mirror',
];

// "5five" — eng ko'p chalkashlik keltirgan umumiy uy-ro'zg'or brendi.
// Kuratsiyalangan katalogdan BUTUNLAY chiqariladi.
const EXCLUDED_BRANDS = ['5five'];
const MIN_PRICE = 15; // juda arzon mayda-chuyda narsalarni chetlab o'tish

async function fetchAllActiveFurniture() {
  const pageSize = 1000;
  let allItems: any[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('furniture')
      .select('id, name, price, style, room_type, category:categories(name), brand:brands(name)')
      .eq('is_active', true)
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('❌ Xato:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;

    allItems = allItems.concat(data);
    console.log(`   ...${allItems.length} ta yuklandi`);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return allItems;
}

function scoreItem(item: any): number {
  let score = 0;
  const categoryName = (item.category?.name ?? '').toLowerCase();
  if (CORE_FURNITURE_CATEGORIES.includes(categoryName)) score += 3;
  if ((item.style?.length ?? 0) > 0) score += 1;
  if ((item.room_type?.length ?? 0) > 0) score += 1;
  return score;
}

async function run() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('📥 Barcha faol mahsulotlar yuklanmoqda...');
  const allItems = await fetchAllActiveFurniture();
  console.log(`✅ Jami ${allItems.length} ta faol mahsulot.\n`);

  // 1-filtr: brend va narx bo'yicha chetlab o'tish
  const eligible = allItems.filter((item) => {
    const brandName = (item.brand?.name ?? '').toLowerCase();
    if (EXCLUDED_BRANDS.some((b) => brandName.includes(b.toLowerCase()))) return false;
    if (Number(item.price) < MIN_PRICE) return false;
    return true;
  });

  console.log(`📊 ${eligible.length} ta mahsulot kuratsiya uchun mos (5five va arzon narsalar chiqarildi).\n`);

  // 2-qadam: har birini ballash
  const scored = eligible.map((item) => ({ ...item, _score: scoreItem(item) }));
  scored.sort((a, b) => b._score - a._score || Number(b.price) - Number(a.price));

  // 3-qadam: har style x room kombinatsiyasi uchun eng yaxshilarni tanlash
  const keepIds = new Set<string>();
  const comboReport: { style: string; room: string; count: number }[] = [];

  for (const style of STYLES) {
    for (const room of ROOM_TYPES) {
      if (keepIds.size >= TARGET_TOTAL) break;

      const matching = scored.filter(
        (item) =>
          (item.style ?? []).includes(style) &&
          (item.room_type ?? []).includes(room) &&
          !keepIds.has(item.id)
      );

      const toAdd = matching.slice(0, PER_COMBO_TARGET);
      toAdd.forEach((item) => keepIds.add(item.id));

      comboReport.push({ style, room, count: toAdd.length });
    }
  }

  // 4-qadam: agar hali 400 taga yetmagan bo'lsa, eng yuqori ballilardan to'ldirish
  if (keepIds.size < TARGET_TOTAL) {
    for (const item of scored) {
      if (keepIds.size >= TARGET_TOTAL) break;
      keepIds.add(item.id);
    }
  }

  console.log('📋 Har kombinatsiya bo\'yicha natija:\n');
  console.table(comboReport);

  console.log(`\n✅ Jami tanlangan: ${keepIds.size} ta mahsulot (maqsad: ${TARGET_TOTAL})`);

  const lowCoverage = comboReport.filter((c) => c.count < 5);
  if (lowCoverage.length > 0) {
    console.log(`\n⚠️  Kam ta'minlangan kombinatsiyalar (5 tadan kam):`);
    lowCoverage.forEach((c) => console.log(`   - ${c.style} / ${c.room}: ${c.count} ta`));
  }

  if (isDryRun) {
    console.log('\n➡️  Bu faqat ko\'rsatish edi. Agar natija mos bo\'lsa, --dry-run siz qayta ishga tushiring.');
    return;
  }

  // 5-qadam: tanlanmaganlarni is_active=false qilish
  const idsToDeactivate = allItems.filter((item) => !keepIds.has(item.id)).map((item) => item.id);

  console.log(`\n🔄 ${idsToDeactivate.length} ta mahsulot is_active=false qilinmoqda...`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < idsToDeactivate.length; i += BATCH_SIZE) {
    const batch = idsToDeactivate.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from('furniture')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .in('id', batch);

    if (error) {
      console.error(`❌ Batch ${i} xato:`, error.message);
    } else {
      console.log(`   ...${Math.min(i + BATCH_SIZE, idsToDeactivate.length)} ta o'chirildi`);
    }
  }

  console.log(`\n✅ Kuratsiya tugadi. Endi faol katalogda ${keepIds.size} ta mahsulot bor.`);
  console.log('   Qolganlar o\'chirilmadi — is_active=false, kerak bo\'lsa qaytarish mumkin.');
}

run().catch((err) => {
  console.error('❌ Skript muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});