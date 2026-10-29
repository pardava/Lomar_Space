import { NextResponse } from "next/server";
import { getCatalogCandidates } from "@/lib/catalog";
import { analyzeRoom } from "@/lib/ai";
import { renderRoomWithAnyDoor } from "@/lib/anydoor";

export const runtime = "nodejs";
export const maxDuration = 180;

// ============================================================
// SINOV UCHUN ALOHIDA ROUTE — hozirgi /api/generate (OpenAI)ga
// tegmaydi. Bu — AnyDoor orqali PIKSEL DARAJASIDA aniq joylashtirish.
//
// Ishlatish (test uchun, brauzer Console'da):
//
// fetch("/api/generate-anydoor", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     imageUrl: "https://res.cloudinary.com/.../room.jpg",
//     style: "scandinavian",
//     roomType: "bedroom",
//     color: "beige",
//   }),
// }).then(r => r.json()).then(console.log);
// ============================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const imageUrl = body.imageUrl;
    const style = body.style || "AI decides";
    const roomType = body.roomType || "AI decides";
    const color = body.color || "AI decides";
    const budget = body.budget || "";

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "imageUrl is required" },
        { status: 400 }
      );
    }

    console.log("1. Downloading room image...");
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Could not download room image. HTTP ${imageResponse.status}`);
    }
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const base64 = imageBuffer.toString("base64");
    console.log("1. Room image downloaded");

    console.log("2. Loading furniture candidates...");
    const candidates = await getCatalogCandidates(roomType, style, color, budget, 30);
    console.log(`Furniture candidates loaded: ${candidates.length}`);

    if (candidates.length === 0) {
      throw new Error("No furniture candidates found in Supabase.");
    }

    console.log("3. Starting room analysis (product selection)...");
    const plan = await analyzeRoom(base64, contentType, style, color, budget, candidates);
    console.log("4. Room analysis completed");
    console.log("Selected product IDs:", plan.selectedProductIds);

    const products = candidates.filter((p) => plan.selectedProductIds.includes(p.id));
    console.log(`Matched real products: ${products.length}`);

    if (products.length === 0) {
      throw new Error("AI could not select any real furniture products.");
    }

    products.forEach((p) => console.log(`- ${p.id} | ${p.name} | €${p.price}`));

    // MUHIM FARQ: bu yerda OpenAI renderRoom o'rniga AnyDoor ishlatiladi —
    // haqiqiy mahsulot rasmini piksel darajasida joylashtiradi.
    console.log("5. Starting AnyDoor placement (real product compositing)...");
    const generatedImage = await renderRoomWithAnyDoor(base64, contentType, products);
    console.log("6. AnyDoor placement completed");

    return NextResponse.json({
      success: true,
      imageUrl: generatedImage,
      plan,
      products,
    });
  } catch (error) {
    console.error("LOMAR ANYDOOR GENERATION ERROR:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}