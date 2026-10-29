import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file provided",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Only image files are supported",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "File is empty",
        },
        {
          status: 400,
        }
      );
    }

    // File -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      `Uploading image: ${(file.size / 1024 / 1024).toFixed(2)} MB`
    );

    // Upload to Cloudinary
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "lomar-uploads",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary upload error:",
              error
            );

            reject(error);
            return;
          }

          if (!result?.secure_url) {
            reject(
              new Error(
                "Cloudinary returned no image URL"
              )
            );
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      stream.on("error", (error) => {
        console.error(
          "Cloudinary stream error:",
          error
        );

        reject(error);
      });

      stream.end(buffer);
    });

    console.log(
      "Cloudinary upload completed:",
      uploadResult.secure_url
    );

    /*
     * IMPORTANT:
     * We also return the original image as base64.
     *
     * /api/generate can use this directly instead
     * of downloading the image from Cloudinary again.
     */
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      success: true,

      // Cloudinary URL
      url: uploadResult.secure_url,

      // Same URL under imageUrl for convenience
      imageUrl: uploadResult.secure_url,

      // Cloudinary public ID
      public_id: uploadResult.public_id,

      // Original image data
      base64,

      // Original MIME type
      mime: file.type,
    });
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown upload error";

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
        details: message,
      },
      {
        status: 500,
      }
    );
  }
}