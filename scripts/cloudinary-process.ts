// ============================================================
// Lomar Space — Cloudinary orqali mahsulot rasmlarini
// render pipeline uchun tayyorlash (fon olib tashlash)
//
// Ishlatish:
//   npx tsx scripts/cloudinary-process.ts --limit=50
//
// Kerak: npm install cloudinary --save-dev
// ============================================================

import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseArgs() {
  const args = process.argv.slice(2);
  const limitArg = args.find((a) => a.startsWith('--limit='));
  return {
    limit: limitArg ? parseInt(limitArg.split('=')[1], 10) : 50,
  };
}

/**
 * Bitta mahsulot rasmini Cloudinary'ga yuklaydi, fonini olib tashlaydi,
 * va natija URL'ini qaytaradi. O'lchamlarni ham qaytaradi (render uchun kerak).
 */
async function processProductImage(productId: string, sourceUrl: string) {
  // Cloudinary'ning "background_removal" add-on'i orqali yuklash.
  // Eslatma: bu add-on Cloudinary hisobingizda yoqilgan bo'lishi kerak
  // (Cloudinary Console > Add-ons > Cloudinary AI Background Removal).
  const result = await cloudinary.uploader.upload(sourceUrl, {
    public_id: `lomar/products/${productId}`,
    background_removal: 'cloudinary_ai',
    overwrite: true,
    resource_type: 'image',
  });

  return {
    transparentUrl: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

async function run() {
  const { limit } = parseArgs();

  console.log(`🖼️  render_ready = false bo'lgan mahsulotlar qidirilmoqda (limit: ${limit})...`);

  const { data: products, error } = await supabase
    .from('furniture')
    .select('id, image_url')
    .eq('render_ready', false)
    .eq('is_active', true)
    .limit(limit);

  if (error) {
    console.error('❌ Mahsulotlarni olishda xato:', error.message);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log('✅ Barcha mahsulotlar allaqachon render uchun tayyor.');
    return;
  }

  console.log(`📊 ${products.length} ta mahsulot qayta ishlanadi...`);

  let success = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const { transparentUrl, width, height } = await processProductImage(
        product.id,
        product.image_url
      );

      const { error: updateError } = await supabase
        .from('furniture')
        .update({
          image_url_transparent: transparentUrl,
          image_width_px: width,
          image_height_px: height,
          render_ready: true,
          last_render_check: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      success++;
      console.log(`✅ ${product.id} tayyor`);
    } catch (err) {
      failed++;
      console.error(`❌ ${product.id} xato:`, err);
    }
  }

  console.log(`\n📈 Natija: ${success} muvaffaqiyatli, ${failed} xato`);
  console.log(`➡️  Keyingi bosqich: bu rasmlarni AnyDoor (Replicate) orqali`);
  console.log(`   render pipeline'ida ishlatish mumkin.`);
}

run().catch((err) => {
  console.error('❌ Skript muvaffaqiyatsiz tugadi:', err);
  process.exit(1);
});