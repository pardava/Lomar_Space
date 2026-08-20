// ============================================================
// Lomar Space — Mahsulotlarga style/room_type avtomatik teglash
// Feed'larda odatda bu ma'lumot yo'q, shuning uchun nom+tavsif
// asosida kalit so'z bilan taxminiy teglaymiz. 400 ta mahsulotni
// qo'lda teglashdan ancha tezroq.
//
// Ishlatish:
//   npx tsx scripts/tag-furniture.ts
//
// Eslatma: bu — boshlang'ich, tezkor yechim. Keyinchalik buni
// GPT/Claude API orqali "bu mahsulot tavsifiga qarab qaysi style va
// xonaga mos" deb so'rovchi versiyaga almashtirish mumkin — aniqroq
// natija beradi, lekin sekinroq va pullik.
// ============================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// tsx orqali ishga tushirilganda .env.local avtomatik o'qilmaydi.
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Style kalit so'zlari ---
const STYLE_KEYWORDS: Record<string, string[]> = {
  scandinavian: ['scandinavian', 'nordic', 'oak', 'light wood', 'birch', 'hygge'],
  modern: ['modern', 'contemporary', 'sleek', 'glass', 'chrome', 'geometric'],
  boho: ['boho', 'bohemian', 'rattan', 'wicker', 'macrame', 'woven', 'terracotta'],
  minimalist: ['minimalist', 'minimal', 'simple', 'clean lines', 'monochrome'],
};

// --- Room type kalit so'zlari ---
const ROOM_KEYWORDS: Record<string, string[]> = {
  living_room: ['sofa', 'couch', 'coffee table', 'tv stand', 'armchair', 'sectional'],
  bedroom: ['bed', 'nightstand', 'wardrobe', 'dresser', 'mattress'],
  kitchen: ['dining table', 'dining chair', 'kitchen', 'bar stool', 'cabinet'],
  home_office: ['desk', 'office chair', 'bookcase', 'shelving unit'],
  kids_room: ['kids', 'children', 'toddler', 'nursery', 'bunk bed'],
  bathroom: ['bathroom', 'vanity', 'towel', 'shower', 'bath mat'],
};

function matchTags(text: string, keywordMap: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matches.push(tag);
    }
  }
  return matches;
}

async function run() {
  console.log('🏷️  Teglash kerak bo\'lgan mahsulotlar qidirilmoqda (style yoki room_type bo\'sh)...');

  const { data: items, error } = await supabase
    .from('furniture')
    .select('id, name, description, style, room_type')
    .eq('is_active', true);

  if (error) {
    console.error('❌ Xato:', error.message);
    process.exit(1);
  }

  const needsTagging = (items ?? []).filter(
    (item) => (item.style?.length ?? 0) === 0 || (item.room_type?.length ?? 0) === 0
  );

  console.log(`📊 ${needsTagging.length} ta mahsulot teglash kerak.`);

  let tagged = 0;
  let skipped = 0;

  for (const item of needsTagging) {
    const searchText = `${item.name} ${item.description ?? ''}`;

    const styleMatches = item.style?.length ? item.style : matchTags(searchText, STYLE_KEYWORDS);
    const roomMatches = item.room_type?.length
      ? item.room_type
      : matchTags(searchText, ROOM_KEYWORDS);

    // Agar hech narsa topilmasa — o'tkazib yuboramiz, qo'lda ko'rib chiqish uchun qoldiramiz
    if (styleMatches.length === 0 && roomMatches.length === 0) {
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('furniture')
      .update({
        style: styleMatches,
        room_type: roomMatches,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (updateError) {
      console.error(`❌ ${item.name}:`, updateError.message);
      skipped++;
    } else {
      tagged++;
    }
  }

  console.log(`\n✅ Teglandi: ${tagged}`);
  console.log(`⚠️  O'tkazib yuborildi (qo'lda ko'rib chiqish kerak): ${skipped}`);
  console.log(`\n➡️  O'tkazib yuborilganlarni Supabase Table Editor'da qo'lda to'ldiring,`);
  console.log(`   yoki kalit so'zlar ro'yxatini (STYLE_KEYWORDS, ROOM_KEYWORDS) kengaytiring.`);
}

run().catch((err) => {
  console.error('❌ Skript muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});