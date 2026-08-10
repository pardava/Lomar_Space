import { NextRequest, NextResponse } from "next/server";
import { generateRoomDesign } from "@/lib/replicate";

export const runtime = "nodejs";
export const maxDuration = 60; // FLUX generations usually take a few seconds, but leave headroom

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, style, roomType } = await req.json();

    if (!imageUrl || !style) {
      return NextResponse.json(
        { error: "imageUrl and style are required" },
        { status: 400 }
      );
    }

    const result = await generateRoomDesign({ imageUrl, style, roomType });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
