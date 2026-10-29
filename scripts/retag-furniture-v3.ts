
// ============================================================
// Lomar Space — Mahsulotlarga style/room_type teglash (V3)
//
// V2'dagi muammo: kalit so'zlar description'ning istalgan joyida
// qidirilgan, shuning uchun "Betttisch" (laptop stoli) 'bett' so'zi
// borligi uchun "bedroom" bo'lib qoldi, "Kissenbezug ... für Sofa und
// Schlafzimmer" kabi yostiq g'ilofi ham "bedroom"ga tushib qoldi.
//
// V3 nima qiladi:
//   1. Kategoriya asosida ISHONCHLI xona biriktirish (bed->bedroom,
//      sofa->living_room, desk->home_office, wardrobe->bedroom) —
//      bular har doim to'g'ri, description'ga qaramaydi.
//   2. Qolganlar uchun — FAQAT mahsulot NOMIDA (description emas),
//      SO'Z CHEGARASI bilan (\bbett\b, "Betttisch" ga mos kelmaydi)
//      qidiradi.
//   3. --force bilan barcha faol mahsulotlarni qayta baholaydi.
//
// Ishlatish:
//   npx tsx scripts/retag-furniture-v3.ts --force
// ============================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- 1. Kategoriya -> xona ISHONCHLI mapping ---
// Bu kategoriyalar boshqa hech narsani tekshirmasdan, to'g'ridan-to'g'ri
// shu xonaga biriktiriladi (chunki bir xonali mebel turlari).
const CATEGORY_ROOM_MAP: Record<string, string[]> = {
  bed: ['bedroom'],
  sofa: ['living_room'],
  desk: ['home_office'],
  wardrobe: ['bedroom'],
};

// --- 2. Style kalit so'zlari (so'z chegarasi bilan tekshiriladi) ---
const STYLE_KEYWORDS: Record<string, string[]> = {
  scandinavian: ['scandinavian', 'nordic', 'skandinavisch', 'hygge'],
  modern: ['modern', 'contemporary', 'zeitgenössisch', 'geometrisch'],
  boho: [
    'boho', 'bohemian', 'rattan', 'macrame', 'terracotta',
    'orientalisch', 'orient', 'marokkanisch', 'marokko', 'indisch',
    'makramee', 'terrakotta', 'ethno',
  ],
  minimalist: ['minimalist', 'minimalistisch', 'schlicht'],
};

// --- 3. Room kalit so'zlari — FAQAT nomda, so'z chegarasi bilan ---
// Diqqat: description ATAYLAB tekshirilmaydi (V2'dagi asosiy xato shu edi).
const ROOM_KEYWORDS: Record<string, string[]> = {
  living_room: ['sofa', 'couch', 'coffee table', 'couchtisch', 'sessel'],
  bedroom: ['bett', 'nachttisch', 'kleiderschrank', 'matratze', 'schlafzimmer'],
  kitchen: ['esstisch', 'esszimmerstuhl', 'küche', 'barhocker'],
  home_office: ['schreibtisch', 'bürostuhl', 'bücherregal'],
  kids_room: ['kinderzimmer', 'kinderbett', 'hochbett', 'kleinkind'],
  bathroom: ['badezimmer', 'dusche', 'badematte', 'waschbecken'],
};

function matchWithWordBoundary(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => {
    // So'z chegarasi bilan qidirish — "bett" so'zi "betttisch" ichida
    // mos kelmaydi, lekin "Bett" yoki "Bett-Set" kabi mos keladi.
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escaped}`, 'i');
    return pattern.test(lower);
  });
}

function matchTags(text: string, keywordMap: Record<string, string[]>): string[] {
  const matches: string[] = [];
  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (matchWithWordBoundary(text, keywords)) {
      matches.push(tag);
    }
  }
  return matches;
}

async function fetchAllFurniture() {
  const pageSize = 1000;
  let allItems: any[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('furniture')
      .select('id, name, description, style, room_type, category:categories(name)')
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
  console.log('📥 Barcha faol mahsulotlar yuklanmoqda...');
  const items = await fetchAllFurniture();
  console.log(`✅ Jami ${items.length} ta mahsulot yuklandi.\n`);

  let categoryBased = 0;
  let keywordBased = 0;
  let unchanged = 0;
  let noMatch = 0;

  for (const item of items) {
    const categoryName = (item.category?.name ?? '').toLowerCase();
    const nameOnly = item.name ?? '';
    const fullText = `${item.name} ${item.description ?? ''}`;

    let roomMatches: string[];

    // 1-ustuvorlik: kategoriya asosida ishonchli mapping
    if (CATEGORY_ROOM_MAP[categoryName]) {
      roomMatches = CATEGORY_ROOM_MAP[categoryName];
      categoryBased++;
    } else {
      // 2-ustuvorlik: nomda so'z chegarasi bilan qidirish
      roomMatches = matchTags(nameOnly, ROOM_KEYWORDS);
      if (roomMatches.length > 0) keywordBased++;
    }

    // Style — description'da ham qidirish mumkin (kamroq xavfli)
    const styleMatches = matchTags(fullText, STYLE_KEYWORDS);

    const finalStyle = styleMatches.length > 0 ? styleMatches : (item.style ?? []);
    const finalRoom = roomMatches.length > 0 ? roomMatches : (item.room_type ?? []);

    if (finalStyle.length === 0 && finalRoom.length === 0) {
      noMatch++;
      continue;
    }

    const sameStyle = JSON.stringify(finalStyle) === JSON.stringify(item.style ?? []);
    const sameRoom = JSON.stringify(finalRoom) === JSON.stringify(item.room_type ?? []);
    if (sameStyle && sameRoom) {
      unchanged++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('furniture')
      .update({
        style: finalStyle,
        room_type: finalRoom,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (updateError) {
      console.error(`❌ ${item.name}:`, updateError.message);
    }
  }

  console.log(`\n✅ Kategoriya asosida biriktirildi: ${categoryBased}`);
  console.log(`✅ Kalit so'z (nom) asosida biriktirildi: ${keywordBased}`);
  console.log(`⏸️  O'zgarishsiz qoldi: ${unchanged}`);
  console.log(`⚠️  Hech narsaga mos kelmadi: ${noMatch}`);
}

run().catch((err) => {
  console.error('❌ Skript muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});