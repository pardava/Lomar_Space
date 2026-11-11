import OpenAI from "openai";
import type { Product } from "./catalog";
 
function client() {
  const key = process.env.OPENAI_API_KEY;
 
  if (!key) {
    throw new Error("OPENAI_API_KEY is missing.");
  }
 
  return new OpenAI({ apiKey: key });
}
 
function safeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
 
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
 
  return [];
}
 
function productLabel(product: Product) {
  return String(
    (product as any).ai_product_type ??
      (product as any).category ??
      "unknown"
  );
}
 
// Short text-only description for the analysis step (no URLs, no rooms).
function catalogProductText(product: Product) {
  return `
PRODUCT ID: ${product.id}
NAME: ${product.name}
TYPE: ${productLabel(product)}
PRICE: ${product.price} ${product.currency ?? "EUR"}
STYLE: ${safeArray(product.ai_style ?? product.style).join(", ") || "unknown"}
COLORS: ${safeArray(product.colors).join(", ") || "unknown"}
MATERIALS: ${safeArray(product.materials).join(", ") || "unknown"}
`;
}
 
export async function analyzeRoom(
  base64: string,
  mime: string,
  style: string,
  color: string,
  budget: string,
  candidates: Product[] = [],
  roomType: string = "AI decides",
  rules: string = ""
) {
  const catalogText = candidates
    .map(catalogProductText)
    .join("\n----------------\n");
 
  const prompt = `
You are LOMAR Space, an AI interior designer.
 
Look at the uploaded room photo and choose furniture ONLY from the catalog below.
Never invent products or IDs. Use the exact PRODUCT ID.
 
USER PREFERENCES
Room type: ${roomType}
Style: ${style}
Color: ${color}
Budget: ${budget}
 
CATALOG PRODUCTS
${catalogText || "No catalog products available."}
 
SELECTION RULES
- Select 5 to 7 products in total.
- At most 2 products of the same TYPE.
- Never select outdoor or garden furniture, cushions, table bases or furniture sets.
- Respect the requested room type.
- Prefer products matching the requested style, color and budget.
- The selected products will be rendered from their real product photos.
${rules}
 
Return ONLY valid JSON in exactly this structure:
 
{
  "roomType": "bedroom",
  "style": "modern",
  "palette": ["warm beige", "soft white"],
  "selectedProductIds": ["PRODUCT_ID_1", "PRODUCT_ID_2"]
}
`;
 
  const response = await client().chat.completions.create({
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-5.6-luna",
    reasoning_effort: "none" as any, // if the API rejects "none", use "low"
    verbosity: "low" as any,
    max_completion_tokens: 600,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a precise interior design assistant. Always return valid JSON and only select products from the provided catalog.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mime};base64,${base64}`,
              detail: "low",
            },
          },
        ],
      },
    ],
  });
 
  const raw = response.choices[0]?.message?.content;
 
  if (!raw) {
    throw new Error("OpenAI returned an empty room analysis.");
  }
 
  console.log("RAW AI PLAN:", raw);
 
  let plan: any;
 
  try {
    plan = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI returned invalid JSON.");
  }
 
  const catalogIds = new Set(candidates.map((p) => String(p.id)));
 
  const selectedProductIds = Array.isArray(plan.selectedProductIds)
    ? Array.from(
        new Set(
          plan.selectedProductIds
            .map(String)
            .filter((id: string) => catalogIds.has(id))
        )
      )
    : [];
 
  plan.selectedProductIds = selectedProductIds;
 
  plan.roomType = plan.roomType || roomType || "living_room";
  plan.style = plan.style || style || "modern";
  plan.palette = Array.isArray(plan.palette) ? plan.palette : [];
  plan.rules = rules;
 
  return plan;
}
 
async function productImageToFile(
  product: Product
): Promise<File | null> {
  const url = product.image_url_transparent || product.image_url;
 
  // Skip missing URLs and relative placeholders like /placeholder-furniture.svg
  if (!url || !/^https?:\/\//i.test(url)) {
    console.warn(`No usable image URL for product ${product.id}`);
    return null;
  }
 
  try {
    const response = await fetch(url);
 
    if (!response.ok) {
      console.warn(
        `Failed to fetch product image ${product.id}: ${response.status}`
      );
      return null;
    }
 
    const arrayBuffer = await response.arrayBuffer();
 
    const contentType =
      response.headers.get("content-type") || "image/jpeg";
 
    const extension = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
      ? "webp"
      : "jpg";
 
    return new File(
      [Buffer.from(arrayBuffer)],
      `product-${product.id}.${extension}`,
      {
        type: contentType,
      }
    );
  } catch (error) {
    console.error(`Could not load product image ${product.id}:`, error);
    return null;
  }
}
 
function imageQuality(): "low" | "medium" | "high" {
  const q = process.env.OPENAI_IMAGE_QUALITY || "";
  return (["low", "medium", "high"].includes(q) ? q : "medium") as
    | "low"
    | "medium"
    | "high";
}
 
export async function renderRoom(
  base64: string,
  mime: string,
  plan: any,
  products: Product[] = []
) {
  if (!products.length) {
    throw new Error("No real Supabase products selected.");
  }
 
  const roomExtension = mime.split("/")[1] || "jpg";
 
  const roomFile = new File([Buffer.from(base64, "base64")], `room.${roomExtension}`, {
    type: mime,
  });
 
  console.log(
    `Fetching real product images for ${products.length} products...`
  );
 
  const productFileResults = await Promise.all(
    products.map((product) => productImageToFile(product))
  );
 
  const referencedProducts: {
    product: Product;
    file: File;
  }[] = [];
 
  products.forEach((product, index) => {
    const file = productFileResults[index];
 
    if (file) {
      referencedProducts.push({ product, file });
    }
  });
 
  if (!referencedProducts.length) {
    throw new Error("Could not load any real product images for rendering.");
  }
 
  console.log(
    `Successfully loaded ${referencedProducts.length}/${products.length} product reference images.`
  );
 
  const referenceMap = referencedProducts
    .map(
      ({ product }, index) =>
        `image_${index + 2} = EXACT real photo of PRODUCT ID ${product.id} (${product.name}, ${productLabel(product)}). Use this image as the literal source of truth for this item's appearance — do not redesign, restyle, recolor, or reinterpret it. Only change its scale, angle, and position to fit naturally in the room.`
    )
    .join("\n");
 
  const productText = referencedProducts
    .map(({ product }) => {
      return `
REAL LOMAR PRODUCT
 
PRODUCT ID: ${product.id}
NAME: ${product.name}
TYPE: ${productLabel(product)}
COLORS: ${safeArray(product.colors).join(", ")}
MATERIALS: ${safeArray(product.materials).join(", ")}
IMAGE: provided as a reference image
`;
    })
    .join("\n----------------\n");
 
  const prompt = `
Create a premium photorealistic interior visualization.
 
The first image is the ORIGINAL ROOM.
The additional images are REAL LOMAR furniture product photos.
 
ROOM TYPE:
${plan.roomType}
 
STYLE:
${plan.style}
 
PALETTE:
${safeArray(plan.palette).join(", ")}
 
REAL PRODUCTS:
${productText}
 
PRODUCT IMAGE MAPPING:
${referenceMap}
 
PLACEMENT RULES:
${plan.rules ?? ""}
Place the furniture naturally and realistically.
A product photo may be used more than once when the room needs several copies
(for example nightstands on both sides of a bed, or several chairs around a dining table).
Place a rug under the main furniture group so it extends beyond the furniture.
Place lamps and decor items on suitable surfaces or on the floor where appropriate.
 
CRITICAL PRODUCT RULES:
 
1. Use the REAL supplied product images as the exact visual source.
2. Do not invent furniture.
3. Do not replace supplied products with similar-looking furniture.
4. Do not redesign the products.
5. Do not change their colors.
6. Do not change their materials.
7. Do not change their shape.
8. Do not add logos or remove important product details.
9. Only adjust realistic scale, perspective, rotation and placement.
10. The final image must contain the actual catalog products.
11. Preserve the architecture of the original room.
12. Preserve walls, windows, doors, flooring and major architectural elements.
13. Make the result photorealistic.
14. Use realistic lighting and shadows.
15. Maintain natural proportions.
16. Avoid floating furniture.
17. Avoid distorted furniture.
18. Do not add products that were not supplied.
 
The result should look like a professionally photographed, fully furnished version of the original room.
`;
 
  const image = await client().images.edit({
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
 
    image: [roomFile, ...referencedProducts.map((item) => item.file)],
 
    prompt,
 
    size: "1536x1024",
 
    quality: imageQuality(),
  });
 
  const output = image.data?.[0];
 
  if (!output) {
    throw new Error("OpenAI image generation returned no image.");
  }
 
  if (output.b64_json) {
    return `data:image/png;base64,${output.b64_json}`;
  }
 
  if (output.url) {
    return output.url;
  }
 
  throw new Error(
    "OpenAI image generation returned neither b64_json nor url."
  );
}