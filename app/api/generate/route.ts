import { NextRequest, NextResponse } from "next/server";
import { generateRoomDesign } from "@/lib/replicate";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { imageUrl, style, roomType } = body;

    console.log("=== GENERATE REQUEST ===");
    console.log("imageUrl:", imageUrl);
    console.log("style:", style);
    console.log("roomType:", roomType);

    if (!imageUrl || !style) {
      return NextResponse.json(
        {
          error: "imageUrl and style are required",
        },
        { status: 400 }
      );
    }

    const result = await generateRoomDesign({
      imageUrl,
      style,
      roomType,
    });

    console.log("=== GENERATE RESULT ===");
    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("=== GENERATE ERROR ===");
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    return NextResponse.json(
      {
        error: "Generation failed",
        details: message,
      },
      { status: 500 }
    );
  }
}