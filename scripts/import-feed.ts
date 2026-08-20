// ============================================================
// Lomar Space — Affiliate feed import skripti
// Awin / CJ Affiliate CSV feed'ini 'furniture' jadvaliga yuklaydi
//
// Ishlatish:
//   npx tsx scripts/import-feed.ts --file=./feeds/ikea.csv --brand="IKEA" --style=scandinavian
//
// Eslatma: --style flag ixtiyoriy — agar feed'dagi barcha mahsulotlar
// bitta stylega tegishli bo'lsa (masalan alohida "Scandinavian" kolleksiya
// feed'i), shu flag orqali hammasiga bir vaqtda tag qo'yiladi. Aks holda
// style/room_type keyinroq alohida tag-furniture.ts skripti bilan to'ldiriladi.
//
// Kerak: npm install csv-parse @supabase/supabase-js tsx --save-dev
// ============================================================

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import type { RawFeedProduct, StyleTag, RoomTypeTag } from '../types/catalog';

// tsx orqali ishga tushirilganda .env.local avtomatik o'qilmaydi,
// shuning uchun qo'lda yuklaymiz (Next.js buni ichida o'zi qiladi).
config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    '❌ NEXT_PUBLIC_SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY .env faylida bo\'lishi kerak'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => args.find((a) => a.startsWith(`--${flag}=`))?.split('=')[1];

  const filePath = get('file');
  const brandName = get('brand');
  const style = get('style') as StyleTag | undefined;
  const roomType = get('room') as RoomTypeTag | undefined;

  if (!filePath || !brandName) {
    console.error(
      'Ishlatish: npx tsx scripts/import-feed.ts --file=./feeds/ikea.csv --brand="IKEA" [--style=scandinavian] [--room=living_room]'
    );
    process.exit(1);
  }

  return { filePath, brandName, style, roomType };
}

// Feed'dagi kategoriya nomini mavjud 'categories' jadvalidagi nomlarga moslashtirish
const CATEGORY_KEYWORDS: Record<string, string> = {
  sofa: 'Sofa',
  couch: 'Sofa',
  sectional: 'Sofa',
  bed: 'Bed',
  mattress: 'Bed',
  nightstand: 'Nightstand',
  table: 'Table',
  'coffee table': 'Coffee Table',
  'dining table': 'Dining Table',
  desk: 'Desk',
  chair: 'Chair',
  'dining chair': 'Dining Chair',
  armchair: 'Chair',
  stool: 'Chair',
  wardrobe: 'Wardrobe',
  closet: 'Wardrobe',
  lamp: 'Lighting',
  light: 'Lighting',
  lighting: 'Lighting',
  rug: 'Rug',
  carpet: 'Rug',
  decor: 'Decor',
  mirror: 'Decor',
  vase: 'Decor',
  storage: 'Storage',
  cabinet: 'Storage',
};

function guessCategoryName(hint: string | undefined): string {
  if (!hint) return 'Decor';
  const lower = hint.toLowerCase();
  for (const [keyword, name] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(keyword)) return name;
  }
  return 'Decor';
}

async function importFeed(
  filePath: string,
  brandName: string,
  defaultStyle?: StyleTag,
  defaultRoomType?: RoomTypeTag
) {
  console.log(`📦 Feed o'qilmoqda: ${filePath} (brand: ${brandName})`);

  // 1. Brendni topish (yoki yaratish, agar mavjud bo'lmasa)
  let { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single();

  if (!brand) {
    console.log(`ℹ️  Brend '${brandName}' topilmadi, yangi yaratilmoqda...`);
    const { data: newBrand, error: createError } = await supabase
      .from('brands')
      .insert({ name: brandName })
      .select('id')
      .single();

    if (createError || !newBrand) {
      console.error('❌ Brend yaratib bo\'lmadi:', createError?.message);
      process.exit(1);
    }
    brand = newBrand;
  }

  // 2. Kategoriyalarni oldindan yuklab olish (name -> id map)
  const { data: categories } = await supabase.from('categories').select('id, name');
  const categoryMap = new Map((categories ?? []).map((c) => [c.name, c.id]));

  // 3. CSV faylni o'qish
  const raw = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const rows: RawFeedProduct[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`📊 ${rows.length} ta qator topildi. Import boshlanmoqda...`);

  let successCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    try {
      const categoryName = guessCategoryName(row.category_hint);
      const categoryId = categoryMap.get(categoryName);

      const styleArray = defaultStyle ? [defaultStyle] : [];
      const roomTypeArray = defaultRoomType ? [defaultRoomType] : [];

      const { error: upsertError } = await supabase.from('furniture').upsert(
        {
          sku: row.sku,
          name: row.name,
          description: row.description ?? null,
          brand_id: brand.id,
          category_id: categoryId ?? null,
          price: parseFloat(String(row.price)),
          currency: row.currency ?? 'EUR',
          image_url: row.image_url,
          product_url: row.product_url,
          affiliate_url: row.product_url,
          affiliate_network: 'awin', // kerak bo'lsa CLI flag qo'shib parametrlashtirish mumkin
          width_cm: row.width_cm ? parseFloat(String(row.width_cm)) : null,
          height_cm: row.height_cm ? parseFloat(String(row.height_cm)) : null,
          depth_cm: row.depth_cm ? parseFloat(String(row.depth_cm)) : null,
          style: styleArray,
          room_type: roomTypeArray,
          is_active: true,
          feed_last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'sku' }
      );

      if (upsertError) {
        console.error(`❌ Xato (${row.sku}):`, upsertError.message);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Kutilmagan xato (${row.sku}):`, err);
      errorCount++;
    }
  }

  console.log('\n✅ Import tugadi:');
  console.log(`   Muvaffaqiyatli: ${successCount}`);
  console.log(`   Xatolik: ${errorCount}`);

  if (!defaultStyle || !defaultRoomType) {
    console.log(`\n⚠️  Style/room_type to'liq belgilanmadi (--style yoki --room berilmagan).`);
    console.log(`   Bu mahsulotlarni keyinroq tag-furniture.ts skripti bilan to'ldiring,`);
    console.log(`   aks holda ular marketplace filtrida ko'rinmaydi.`);
  }

  console.log(`\n➡️  Keyingi qadam: fon tozalash uchun cloudinary-process.ts ni ishga tushiring.`);
}

const { filePath, brandName, style, roomType } = parseArgs();
importFeed(filePath, brandName, style, roomType).catch((err) => {
  console.error('❌ Import muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});