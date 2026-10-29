// ============================================================
// Lomar Space — Mahsulotlarga style/room_type avtomatik teglash
// YAKUNIY VERSIYA — pagination bilan (3000+ yozuvni to'liq oladi),
// nemischa + inglizcha kalit so'zlar bilan
//
// Ishlatish:
//   npx tsx scripts/tag-furniture.ts            (faqat bo'shlarni teglaydi)
//   npx tsx scripts/tag-furniture.ts --force     (hammasini qayta baholaydi)
// ============================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STYLE_KEYWORDS: Record<string, string[]> = {
  scandinavian: [
    'scandinavian', 'nordic', 'oak', 'light wood', 'birch', 'hygge',
    'skandinavisch', 'eiche', 'helles holz', 'birke',
  ],
  modern: [
    'modern', 'contemporary', 'sleek', 'glass', 'chrome', 'geometric',
    'zeitgenössisch', 'glas', 'chrom', 'geometrisch',
  ],
  boho: [
    'boho', 'bohemian', 'rattan', 'wicker', 'macrame', 'woven', 'terracotta',
    'orientalisch', 'orient', 'marokkanisch', 'marokko', 'indisch',
    'geflochten', 'makramee', 'terrakotta', 'ethno',
  ],
  minimalist: [
    'minimalist', 'minimal', 'simple', 'clean lines', 'monochrome',
    'minimalistisch', 'schlicht', 'einfarbig',
  ],
};

const ROOM_KEYWORDS: Record<string, string[]> = {
  living_room: [
    'sofa', 'couch', 'coffee table', 'tv stand', 'armchair', 'sectional',
    'wohnzimmer', 'couchtisch', 'fernsehkommode', 'sessel', 'paravent',
  ],
  bedroom: [
    'bed', 'nightstand', 'wardrobe', 'dresser', 'mattress',
    'bett', 'nachttisch', 'kleiderschrank', 'kommode', 'matratze',
    'schlafzimmer',
  ],
  kitchen: [
    'dining table', 'dining chair', 'kitchen', 'bar stool', 'cabinet',
    'esstisch', 'esszimmerstuhl', 'küche', 'barhocker', 'schrank',
  ],
  home_office: [
    'desk', 'office chair', 'bookcase', 'shelving unit',
    'schreibtisch', 'bürostuhl', 'bücherregal', 'büro',
  ],
  kids_room: [
    'kids', 'children', 'toddler', 'nursery', 'bunk bed',
    'kinder', 'kinderzimmer', 'kleinkind', 'hochbett',
  ],
  bathroom: [
    'bathroom', 'vanity', 'towel', 'shower', 'bath mat',
    'badezimmer', 'handtuch', 'dusche', 'badematte',
  ],
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

async function fetchAllFurniture() {
  // Supabase standart holatda bitta so'rovda maksimal 1000 qator qaytaradi.
  // 3000+ yozuvni to'liq olish uchun sahifalab (pagination) yuklaymiz.
  const pageSize = 1000;
  let allItems: any[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('furniture')
      .select('id, name, description, style, room_type')
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

async function run() {
  const forceRetag = process.argv.includes('--force');

  console.log(
    forceRetag
      ? '🏷️  MAJBURIY QAYTA TEGLASH: barcha faol mahsulotlar tekshiriladi...'
      : '🏷️  Teglash kerak bo\'lgan mahsulotlar qidirilmoqda...'
  );

  console.log('📥 Barcha mahsulotlar yuklanmoqda (sahifalab)...');
  const items = await fetchAllFurniture();
  console.log(`✅ Jami ${items.length} ta faol mahsulot yuklandi.\n`);

  const needsTagging = forceRetag
    ? items
    : items.filter(
        (item) => (item.style?.length ?? 0) === 0 || (item.room_type?.length ?? 0) === 0
      );

  console.log(`📊 ${needsTagging.length} ta mahsulot ${forceRetag ? 'tekshiriladi' : 'teglash kerak'}.`);

  let tagged = 0;
  let unchanged = 0;
  let skipped = 0;
  const skippedNames: string[] = [];

  for (const item of needsTagging) {
    const searchText = `${item.name} ${item.description ?? ''}`;

    const newStyleMatches = matchTags(searchText, STYLE_KEYWORDS);
    const newRoomMatches = matchTags(searchText, ROOM_KEYWORDS);

    const styleMatches = newStyleMatches.length > 0 ? newStyleMatches : (item.style ?? []);
    const roomMatches = newRoomMatches.length > 0 ? newRoomMatches : (item.room_type ?? []);

    if (styleMatches.length === 0 && roomMatches.length === 0) {
      skipped++;
      skippedNames.push(item.name);
      continue;
    }

    const sameStyle = JSON.stringify(styleMatches) === JSON.stringify(item.style ?? []);
    const sameRoom = JSON.stringify(roomMatches) === JSON.stringify(item.room_type ?? []);
    if (forceRetag && sameStyle && sameRoom) {
      unchanged++;
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
      if (tagged % 200 === 0) console.log(`   ...${tagged} ta yangilandi`);
    }
  }

  console.log(`\n✅ Yangilandi: ${tagged}`);
  if (forceRetag) console.log(`⏸️  O'zgarishsiz qoldi: ${unchanged}`);
  console.log(`⚠️  Hech qanday tegga mos kelmadi: ${skipped}`);

  if (skippedNames.length > 0) {
    console.log(`\nMos kelmagan mahsulotlar namunasi (birinchi 15 ta):`);
    skippedNames.slice(0, 15).forEach((n) => console.log(`  - ${n}`));
  }

  console.log(`\n➡️  Mos kelmaganlarni Supabase Table Editor'da qo'lda to'ldiring.`);
}

run().catch((err) => {
  console.error('❌ Skript muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});