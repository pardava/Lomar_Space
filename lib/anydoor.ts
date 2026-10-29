// ============================================================
// Lomar Space — AnyDoor orqali haqiqiy mahsulotni xonaga
// PIKSEL DARAJASIDA joylashtirish
//
// TUZATILGAN VERSIYA — muhim xatolar hal qilindi:
// 1. Model versiyasi aniq hash bilan belgilandi (404 xatosini
//    hal qiladi — "ali-vilab/anydoor" nomi yolg'iz yetarli emas edi).
// 2. API maydon nomlari TO'G'IRLANDI:
//    - reference_image (avval noto'g'ri: foreground_image)
//    - reference_mask  (avval noto'g'ri: foreground_mask)
//    - bg_image        (avval noto'g'ri: background_image)
//    - bg_mask         (AVVAL UMUMAN YO'Q EDI — bu jiddiy xato!)
// 3. bg_mask endi haqiqatan yaratiladi va yuboriladi — bu AI
//    aniqlagan bounding box'dan (getPlacementBoxes) kelib chiqadi
//    va "xonada AYNAN QAYERGA joylashtirish kerak"ligini bildiradi.
//    Buni yubormasdan, AnyDoor qayerga qo'yishni bilmas edi.
//
// Kerak: npm install replicate sharp
// ============================================================

import Replicate from "replicate";
import sharp from "sharp";
import OpenAI from "openai";
import type { Product } from "./catalog";

// Replicate'dagi rasmiy versiya hash'i (2026-08-29 holatiga ko'ra eng so'nggi).
// Agar kelajakda 404 xatosi qaytsa, https://replicate.com/ali-vilab/anydoor/versions
// sahifasidan yangi hash'ni oling va shu yerni yangilang.
const ANYDOOR_MODEL_VERSION =
  "ali-vilab/anydoor:542c963129c4661ab53a875b1b9a84b2102ca784cf872ef2752a468721c0eb2a";

function openaiClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function replicateClient() {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN is missing");
  }
  return new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
}

export interface PlacementBox {
  productId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 1-QADAM: OpenAI Vision'dan har bir tanlangan mahsulot uchun
 * xonada QAYERGA joylashtirish kerakligini (bounding box) so'raymiz.
 */
export async function getPlacementBoxes(
  base64: string,
  mime: string,
  products: Product[]
): Promise<PlacementBox[]> {
  const productList = products
    .map((p, i) => `${i + 1}. ID: ${p.id} | Name: ${p.name} | Category: ${p.category}`)
    .join("\n");

  const prompt = `
You are analyzing a room photo to determine WHERE each piece of
furniture should be placed.

PRODUCTS TO PLACE:
${productList}

For EACH product, return a bounding box showing where in the room
image it should be placed, as fractions of the image width/height
(0.0 to 1.0, top-left origin).

Rules:
- Floor furniture (sofa, chair, table, bed) sits on the floor —
  the bottom of the box should be near the floor line.
- Wall items (mirror, art, shelf) should be placed on visible wall
  area, at a natural height.
- Boxes must not overlap significantly with each other.
- Respect the room's actual empty space.
- Leave reasonable margins; do not place items outside the frame.

Return JSON ONLY in this exact shape:
{
  "placements": [
    { "productId": "...", "x": 0.1, "y": 0.5, "width": 0.25, "height": 0.35 }
  ]
}
`;

  const response = await openaiClient().responses.create({
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-5.6-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: prompt },
          {
            type: "input_image",
            image_url: `data:${mime};base64,${base64}`,
            detail: "auto",
          },
        ],
      },
    ],
  });

  const clean = response.output_text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "");

  try {
    const parsed = JSON.parse(clean);
    const validIds = new Set(products.map((p) => p.id));

    const placements: PlacementBox[] = (parsed.placements ?? [])
      .filter(
        (p: any) =>
          typeof p.productId === "string" &&
          validIds.has(p.productId) &&
          [p.x, p.y, p.width, p.height].every(
            (n) => typeof n === "number" && n >= 0 && n <= 1
          )
      )
      .map((p: any) => ({
        productId: p.productId,
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
      }));

    console.log(`Got ${placements.length} placement boxes from AI`);
    return placements;
  } catch (err) {
    console.error("INVALID PLACEMENT RESPONSE:", response.output_text);
    throw new Error("AI returned invalid placement JSON.");
  }
}

/**
 * 2-QADAM: Bounding box'dan (0-1 nisbiy koordinata) haqiqiy piksel
 * o'lchamli mask yaratish — oq to'rtburchak, qora fon.
 * Bu — bg_mask uchun ishlatiladi (xonada QAYERGA joylashtirish).
 */
async function createMaskFromBox(
  imageWidth: number,
  imageHeight: number,
  box: PlacementBox
): Promise<Buffer> {
  const rectX = Math.round(box.x * imageWidth);
  const rectY = Math.round(box.y * imageHeight);
  const rectW = Math.round(box.width * imageWidth);
  const rectH = Math.round(box.height * imageHeight);

  const svg = `
    <svg width="${imageWidth}" height="${imageHeight}">
      <rect x="0" y="0" width="${imageWidth}" height="${imageHeight}" fill="black" />
      <rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" fill="white" />
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * 3-QADAM: Mahsulot uchun reference rasm va mask tayyorlash
 * (mahsulotning O'ZINING shakli — reference_mask uchun).
 */
async function prepareProductForeground(
  product: Product & { image_url_transparent?: string | null }
): Promise<{ referenceImage: Buffer; referenceMask: Buffer }> {
  const sourceUrl = product.image_url_transparent || product.image_url;

  if (!sourceUrl) {
    throw new Error(`Product ${product.id} has no image_url`);
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Could not download product image: ${sourceUrl}`);
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  if (product.image_url_transparent && metadata.hasAlpha) {
    const mask = await image.clone().extractChannel("alpha").png().toBuffer();
    const referenceImage = await sharp(imageBuffer)
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer();
    return { referenceImage, referenceMask: mask };
  }

  console.warn(
    `Product ${product.id} has no transparent background — using full image as reference mask (lower quality).`
  );
  const width = metadata.width ?? 512;
  const height = metadata.height ?? 512;
  const fullWhiteMask = await sharp({
    create: { width, height, channels: 4, background: "#ffffff" },
  })
    .png()
    .toBuffer();

  return { referenceImage: imageBuffer, referenceMask: fullWhiteMask };
}

/**
 * 4-QADAM: Replicate AnyDoor'ni chaqirib, mahsulotni xonaga joylashtirish.
 */
async function placeOneProduct(
  roomImageBuffer: Buffer,
  product: Product & { image_url_transparent?: string | null },
  box: PlacementBox
): Promise<Buffer> {
  const { referenceImage, referenceMask } = await prepareProductForeground(product);

  // Xona rasmining o'lchamini olish — bg_mask shu o'lchamda bo'lishi kerak
  const roomMetadata = await sharp(roomImageBuffer).metadata();
  const roomWidth = roomMetadata.width ?? 1024;
  const roomHeight = roomMetadata.height ?? 1024;

  // MUHIM: bu — avval umuman yaratilmagan edi. bg_mask — xonada
  // AYNAN qayerga joylashtirish kerakligini ko'rsatadi.
  const bgMask = await createMaskFromBox(roomWidth, roomHeight, box);

  const replicate = replicateClient();

  const output = await replicate.run(ANYDOOR_MODEL_VERSION, {
    input: {
      reference_image_path: referenceImage,
      reference_image_mask: referenceMask,
      bg_image_path: roomImageBuffer,
      bg_mask_path: bgMask,
    },
  });

  // DEBUG: Replicate javascript kutubxonasining yangi versiyalari
  // natijani turli shaklda qaytarishi mumkin (oddiy string, massiv,
  // yoki .url() metodli FileOutput obyekti). Shuning uchun bir nechta
  // holatni tekshiramiz.
  console.log("AnyDoor raw output type:", typeof output, Array.isArray(output));

  let resultUrl: string | undefined;

  if (typeof output === "string") {
    resultUrl = output;
  } else if (Array.isArray(output)) {
    const first = output[0];
    if (typeof first === "string") {
      resultUrl = first;
    } else if (first && typeof (first as any).url === "function") {
      resultUrl = String(await (first as any).url());
    } else if (first && typeof (first as any).url === "string") {
      resultUrl = (first as any).url;
    }
  } else if (output && typeof (output as any).url === "function") {
    resultUrl = String(await (output as any).url());
  } else if (output && typeof (output as any).url === "string") {
    resultUrl = (output as any).url;
  }

  if (!resultUrl) {
    console.error("AnyDoor unrecognized output shape:", JSON.stringify(output, null, 2).slice(0, 500));
  }

  if (!resultUrl || typeof resultUrl !== "string") {
    throw new Error(`AnyDoor did not return a valid result for product ${product.id}`);
  }

  const resultResponse = await fetch(resultUrl);
  if (!resultResponse.ok) {
    throw new Error(`Could not download AnyDoor result for product ${product.id}`);
  }

  return Buffer.from(await resultResponse.arrayBuffer());
}

/**
 * ASOSIY FUNKSIYA: bir nechta mahsulotni ketma-ket xonaga joylashtirish.
 */
export async function renderRoomWithAnyDoor(
  base64RoomImage: string,
  mime: string,
  products: (Product & { image_url_transparent?: string | null })[]
): Promise<string> {
  if (!products.length) {
    throw new Error("No products to place.");
  }

  console.log(`Starting AnyDoor placement for ${products.length} products...`);

  const boxes = await getPlacementBoxes(base64RoomImage, mime, products);

  if (boxes.length === 0) {
    throw new Error("No valid placement boxes returned by AI.");
  }

 let currentImage: Buffer<ArrayBufferLike> = Buffer.from(base64RoomImage, "base64");
  let placedCount = 0;

  for (const product of products) {
    const box = boxes.find((b) => b.productId === product.id);
    if (!box) {
      console.warn(`No placement box for ${product.name}, skipping.`);
      continue;
    }

    // Diqqat: bu mahsulot rasmi haqiqiy va yuklanadigan bo'lishi kerak.
    // Agar image_url noto'g'ri (masalan sinov/demo ma'lumot) bo'lsa,
    // bu bosqich muvaffaqiyatsiz bo'ladi — buni katalogda tekshiring.
    try {
      console.log(`Placing: ${product.name}...`);
      currentImage = await placeOneProduct(currentImage, product, box);
      placedCount++;
      console.log(`Placed: ${product.name}`);
    } catch (err) {
      console.error(`Failed to place ${product.name}:`, err);
    }
  }

  if (placedCount === 0) {
    throw new Error(
      "AnyDoor could not place any products. Check product image URLs and Replicate model version."
    );
  }

  const finalBase64 = currentImage.toString("base64");
  return `data:image/png;base64,${finalBase64}`;
}