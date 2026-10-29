// ============================================================
// Lomar Space — Mebelga aloqasi yo'q mahsulotlarni aniqlash
// (XAVFSIZ VERSIYA — har mahsulot qaysi kalit so'z bilan mos
// tushganini aniq ko'rsatadi, shuning uchun noto'g'ri
// o'chirishlarni oldindan payqash mumkin)
//
// Ishlatish:
//   npx tsx scripts/clean-non-furniture-v2.ts --dry-run
//   npx tsx scripts/clean-non-furniture-v2.ts
// ============================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Diqqat: nemischa harflar (ü, ö, ä) bilan mumkin bo'lgan encoding
// muammolaridan qochish uchun, bu ro'yxatda faqat lotin harflaridan
// iborat, aniq brend/mahsulot nomlari ishlatiladi.
//
// MUHIM: CYBEX va SwitchBot ATAYLAB ro'yxatdan OLIB TASHLANDI —
// CYBEX asosan bolalar mebeli (Babywippe, Hochstuhl — "Möbelstück
// fürs Kinderzimmer" deb tavsiflangan), SwitchBot esa yoritgich
// (Lighting kategoriyasiga mos) sotadi. Bular haqiqiy katalog
// mahsulotlari, o'chirilmasligi kerak.
const NON_FURNITURE_KEYWORDS = [
  'baseus',       // avtomobil aksessuarlari, kamera, HDMI switch
  'samsung',      // maishiy texnika
  'wolfbox',      // avtomobil/elektronika
  'carsun',       // shina kompressori
  'utrai',        // avtomobil start-yordamchi
  'bestway',      // kemping/basseyn aksessuarlari
  'aeg',          // kir yuvish mashinasi/quritgich
  'midea',        // kir yuvish mashinasi/fen/frier
];

async function run() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log(`🔍 Har kalit so'z alohida tekshirilmoqda (shaffoflik uchun)...\n`);

  const allMatches: { id: string; name: string; matchedKeyword: string }[] = [];

  // Har kalit so'zni ALOHIDA so'rov bilan tekshiramiz — bu qaysi
  // so'z aynan qaysi mahsulotga mos tushganini aniq ko'rsatadi,
  // va combined OR filter'dagi kutilmagan natijalarning oldini oladi.
  for (const keyword of NON_FURNITURE_KEYWORDS) {
    const { data, error } = await supabase
      .from('furniture')
      .select('id, name')
      .ilike('name', `%${keyword}%`)
      .eq('is_active', true);

    if (error) {
      console.error(`❌ '${keyword}' uchun xato:`, error.message);
      continue;
    }

    if (data && data.length > 0) {
      console.log(`  "${keyword}" → ${data.length} ta mos mahsulot`);
      data.forEach((d) => allMatches.push({ ...d, matchedKeyword: keyword }));
    }
  }

  // Dublikatlarni olib tashlash (bir mahsulot bir nechta kalit so'zga mos kelishi mumkin)
  const uniqueMatches = Array.from(
    new Map(allMatches.map((m) => [m.id, m])).values()
  );

  console.log(`\n📊 Jami noyob mos mahsulotlar: ${uniqueMatches.length}\n`);
  console.log('To\'liq ro\'yxat (nomi va qaysi so\'zga mos kelgani):\n');

  uniqueMatches.forEach((m) => {
    console.log(`  [${m.matchedKeyword}] ${m.name}`);
  });

  if (isDryRun) {
    console.log('\n➡️  Bu faqat ko\'rsatish edi. Ro\'yxatni ko\'rib chiqing.');
    console.log('   Agar hammasi to\'g\'ri bo\'lsa, --dry-run siz qayta ishga tushiring.');
    return;
  }

  if (uniqueMatches.length === 0) {
    console.log('\n✅ Hech narsa topilmadi, o\'zgartirish kerak emas.');
    return;
  }

  const ids = uniqueMatches.map((m) => m.id);

  const { error: updateError } = await supabase
    .from('furniture')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .in('id', ids);

  if (updateError) {
    console.error('❌ Yangilashda xato:', updateError.message);
    process.exit(1);
  }

  console.log(`\n✅ ${ids.length} ta mahsulot is_active = false qilindi.`);
}

run().catch((err) => {
  console.error('❌ Skript muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});
