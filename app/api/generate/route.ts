import { NextResponse } from "next/server";
import { generateRoomDesign } from "@/lib/replicate";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const imageUrl =
      body.imageUrl;

    const style =
      body.style;

    const roomType =
      body.roomType;

    const color =
      body.color;

    if (!imageUrl) {
      return NextResponse.json(
        {
          error:
            "imageUrl is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!style) {
      return NextResponse.json(
        {
          error:
            "style is required",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await generateRoomDesign({
        imageUrl,
        style,
        roomType,
        color,
      });

    return NextResponse.json({
      imageUrl:
        result.imageUrl,

      modelUsed:
        result.modelUsed,
    });
  } catch (error) {
    console.error(
      "POST /api/generate error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Generation failed",
      },
      {
        status: 500,
      }
    );
  }
}