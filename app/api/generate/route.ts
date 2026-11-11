import { NextResponse } from "next/server";

import { getCatalogCandidates, getProductsByIds } from "@/lib/catalog";
import { analyzeRoom, renderRoom } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(request: Request) {
  const totalStart = performance.now();

  try {
    const body = await request.json();

    const imageUrl = body.imageUrl;
    const style = body.style || "AI decides";
    const roomType = body.roomType || "AI decides";
    const color = body.color || "AI decides";
    const budget = body.budget || "";

    /*
     * TEST MODE (optional)
     */
    const forcedIds: string[] | undefined =
      Array.isArray(body.productIds) && body.productIds.length > 0
        ? body.productIds.map(String)
        : undefined;

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "imageUrl is required",
        },
        { status: 400 }
      );
    }

    /*
     * =====================================================
     * 1. DOWNLOAD ORIGINAL ROOM IMAGE
     * =====================================================
     */

    console.log("1. Downloading room image...");
    console.log("Cloudinary URL:", imageUrl);

    const downloadStart = performance.now();

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(
        `Could not download room image. HTTP ${imageResponse.status}`
      );
    }

    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const base64 = imageBuffer.toString("base64");

    console.log(
      `1. Room image downloaded: ${(imageBuffer.length / 1024 / 1024).toFixed(
        2
      )} MB`
    );

    console.log(
      `⏱ Image download: ${(
        (performance.now() - downloadStart) /
        1000
      ).toFixed(2)}s`
    );

    /*
     * =====================================================
     * 2. LOAD REAL SUPABASE PRODUCTS
     * =====================================================
     */

    console.log("2. Loading furniture candidates...");

    const candidatesStart = performance.now();

    const candidates = forcedIds
      ? await getProductsByIds(forcedIds)
      : await getCatalogCandidates(
          roomType,
          style,
          color,
          budget,
          20
        );

    console.log(
      `⏱ Catalog loading: ${(
        (performance.now() - candidatesStart) /
        1000
      ).toFixed(2)}s`
    );

    if (forcedIds) {
      console.log(`TEST MODE: using ${candidates.length} forced products`);
    }

    console.log(`Furniture candidates loaded: ${candidates.length}`);

    if (!candidates.length) {
      throw new Error("No real furniture candidates found in Supabase.");
    }

    /*
     * =====================================================
     * 3. AI ANALYSIS
     * =====================================================
     */

    console.log("3. Starting room analysis...");

    const analysisStart = performance.now();

    const plan = await analyzeRoom(
      base64,
      contentType,
      style,
      color,
      budget,
      candidates,
      roomType
    );

    console.log("4. Room analysis completed");

    console.log(
      `⏱ AI analysis: ${(
        (performance.now() - analysisStart) /
        1000
      ).toFixed(2)}s`
    );

    /*
     * TEST MODE
     */

    if (forcedIds) {
      plan.selectedProductIds = forcedIds.filter((id) =>
        candidates.some((candidate) => candidate.id === id)
      );
    }

    console.log("Selected product IDs:", plan.selectedProductIds);

    if (
      !Array.isArray(plan.selectedProductIds) ||
      plan.selectedProductIds.length === 0
    ) {
      throw new Error("AI did not select any real catalog products.");
    }

    /*
     * =====================================================
     * 4. LOAD EXACT SELECTED PRODUCTS
     * =====================================================
     */

    console.log("4. Loading EXACT selected products from Supabase...");

    const productsStart = performance.now();

    const products = await getProductsByIds(plan.selectedProductIds);

    console.log(
      `⏱ Exact products loading: ${(
        (performance.now() - productsStart) /
        1000
      ).toFixed(2)}s`
    );

    console.log(`Matched REAL Supabase products: ${products.length}`);

    if (!products.length) {
      throw new Error("Selected product IDs could not be found in Supabase.");
    }

    const missingIds = plan.selectedProductIds.filter(
      (id: string) => !products.some((product) => product.id === id)
    );

    if (missingIds.length > 0) {
      console.error("Missing selected product IDs:", missingIds);

      throw new Error(
        `Some selected products no longer exist in Supabase: ${missingIds.join(
          ", "
        )}`
      );
    }

    console.log("Selected REAL Lomar furniture:");

    products.forEach((product) => {
      console.log(`- ${product.id} | ${product.name} | €${product.price}`);
    });

    /*
     * =====================================================
     * 5. GENERATE ROOM
     * =====================================================
     */

    console.log("5. Starting OpenAI image generation...");

    const renderStart = performance.now();

    const generatedImage = await renderRoom(
      base64,
      contentType,
      plan,
      products
    );

    console.log("6. Room generation completed");

    console.log(
      `⏱ AI image render: ${(
        (performance.now() - renderStart) /
        1000
      ).toFixed(2)}s`
    );

    /*
     * =====================================================
     * 6. SINGLE SOURCE OF TRUTH
     * =====================================================
     */

    const shoppingList = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image_url: product.image_url,
      product_url: product.product_url,
      affiliate_url: product.affiliate_url,
      sku: product.sku,
      category: product.category,
      style: product.style,
      colors: product.colors,
      rooms: product.rooms,
      materials: product.materials,
      description: product.description,
      width: product.width,
      height: product.height,
      depth: product.depth,
      ai_product_type: product.ai_product_type,
      ai_style: product.ai_style,
      in_stock: product.in_stock,
      render_ready: product.render_ready,
    }));

    /*
     * =====================================================
     * 7. TOTAL TIME
     * =====================================================
     */

    console.log(
      `🚀 TOTAL GENERATION TIME: ${(
        (performance.now() - totalStart) /
        1000
      ).toFixed(2)}s`
    );

    /*
     * =====================================================
     * 8. RETURN
     * =====================================================
     */

    return NextResponse.json({
      success: true,
      imageUrl: generatedImage,

      plan: {
        ...plan,
        selectedProductIds: products.map((product) => product.id),
      },

      products: shoppingList,
      shoppingList,
    });
  } catch (error) {
    console.error("LOMAR AI GENERATION ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Generation failed";

    console.log(
      `❌ TOTAL TIME BEFORE ERROR: ${(
        (performance.now() - totalStart) /
        1000
      ).toFixed(2)}s`
    );

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}