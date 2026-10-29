// ============================================================
// Lomar Space — Mebelga aloqasi yo'q mahsulotlarni aniqlash
// va is_active = false qilish (o'chirmaymiz, faqat yashiramiz)
//
// Ishlatish:
//   npx tsx scripts/clean-non-furniture.ts --dry-run   (avval shu bilan tekshiring)
//   npx tsx scripts/clean-non-furniture.ts             (haqiqiy o'zgarish)
// ============================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mebelga aloqasi yo'q, lekin ko'p uchraydigan brend/kalit so'zlar
// (bu ro'yxatni real katalogingizga qarab kengaytiring)
const NON_FURNITURE_KEYWORDS = [
  'baseus',
  'cybex',
  'samsung',
  'switchbot',
  'wolfbox',
  'timemore',
  'molton brown',
  'roba kindermöbel-set außenbereich', // agar chindan mebel bo'lsa, bu qatorni olib tashlang
  'kühlschrank',
  'waschtrockner',
  'waschmaschine',
  'gefrierkombination',
  'autokompressor',
  'reifenkompressor',
  'luftpumpe',
  'überwachungskamera',
  'hochstuhl',
  'babywippe',
  'lernturm',
  'kaffeewaage',
  'duftkerze',
  'campingstuhl',
  'gartenschirm',
  'sonnenschirm',
];

async function run() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log(`🔍 Mebelga aloqasi yo'q mahsulotlar qidirilmoqda...`);
  console.log(isDryRun ? '   (DRY RUN — hech narsa o\'zgartirilmaydi)\n' : '   (HAQIQIY O\'ZGARISH)\n');

  const orFilter = NON_FURNITURE_KEYWORDS.map((kw) => `name.ilike.%${kw}%`).join(',');

  const { data: matches, error } = await supabase
    .from('furniture')
    .select('id, name')
    .or(orFilter)
    .eq('is_active', true);

  if (error) {
    console.error('❌ Xato:', error.message);
    process.exit(1);
  }

  console.log(`📊 ${matches?.length ?? 0} ta mos mahsulot topildi.\n`);

  if (matches && matches.length > 0) {
    console.log('Namunalar (birinchi 10 ta):');
    matches.slice(0, 10).forEach((m) => console.log(`  - ${m.name}`));
    console.log('');
  }

  if (isDryRun) {
    console.log('➡️  Haqiqiy o\'zgartirish uchun --dry-run flagisiz qayta ishga tushiring.');
    return;
  }

  if (!matches || matches.length === 0) {
    console.log('✅ Hech narsa o\'zgartirilmadi.');
    return;
  }

  const ids = matches.map((m) => m.id);

  const { error: updateError } = await supabase
    .from('furniture')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .in('id', ids);

  if (updateError) {
    console.error('❌ Yangilashda xato:', updateError.message);
    process.exit(1);
  }

  console.log(`✅ ${ids.length} ta mahsulot is_active = false qilindi (marketplace/render'da ko'rinmaydi).`);
  console.log(`   Ular o'chirilmadi — Supabase'da qolgan, kerak bo'lsa qaytarish mumkin.`);
}

run().catch((err) => {
  console.error('❌ Skript muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});
