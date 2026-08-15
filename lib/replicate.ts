const REPLICATE_API_TOKEN =
  process.env.REPLICATE_API_TOKEN;

const PRIMARY_MODEL =
  process.env.REPLICATE_LORA_MODEL;

const FALLBACK_MODEL =
  "black-forest-labs/flux-kontext-pro";

interface GenerateParams {
  imageUrl: string;
  style: string;
  roomType?: string;
  color?: string;
}

function buildPrompt({
  style,
  roomType,
  color,
}: GenerateParams): string {
  const room = roomType
    ? roomType.replaceAll("_", " ")
    : "room";

  const palette = color || "natural";

  /*
   * ROOM-SPECIFIC FURNITURE
   */
  let furniture = "";

  switch (roomType) {
    case "bedroom":
      furniture = `
      Add a realistic bed appropriate for the room.
      Add bedside tables.
      Add a wardrobe or dresser where appropriate.
      Add bedside lighting.
      Add a rug where appropriate.
      `;

      break;

    case "kitchen":
      furniture = `
      Add realistic kitchen cabinetry.
      Add a kitchen island or dining surface where appropriate.
      Add dining chairs if appropriate.
      Add realistic kitchen lighting.
      Add tasteful kitchen accessories.
      `;

      break;

    case "dining_room":
      furniture = `
      Add a dining table.
      Add matching dining chairs.
      Add a sideboard or console where appropriate.
      Add dining room lighting.
      Add tasteful decorative objects.
      `;

      break;

    case "office":
      furniture = `
      Add a realistic work desk.
      Add a comfortable office chair.
      Add storage furniture.
      Add a desk lamp.
      Add tasteful office decoration.
      `;

      break;

    case "bathroom":
      furniture = `
      Add realistic bathroom furniture and fixtures.
      Add vanity storage.
      Add mirrors.
      Add appropriate lighting.
      Add tasteful bathroom accessories.
      `;

      break;

    default:
      furniture = `
      Add a large comfortable sofa.
      Add a coffee table.
      Add a decorative area rug.
      Add side tables.
      Add floor or table lighting.
      Add indoor plants.
      Add tasteful wall decoration.
      `;
  }

  return `
Transform this ${room} into a COMPLETE,
FULLY FURNISHED ${style} interior.

IMPORTANT:
The room MUST NOT remain empty.

ROOM TYPE:
This is specifically a ${room}.
Use furniture that belongs to a ${room}.

FURNITURE:
${furniture}

COLOR PALETTE:
Use ${palette} as the dominant color palette.
Coordinate furniture, textiles, walls, decor and accessories
with this color palette.
Do not ignore the requested color.

STYLE:
The complete room must follow the ${style}
interior design style.

ARCHITECTURE:
Keep the original architecture exactly the same.
Keep walls.
Keep windows.
Keep doors.
Keep ceiling.
Keep floor.
Keep camera position.
Keep perspective.

FURNITURE QUALITY:
Use realistic high-quality furniture.
Correct proportions.
Furniture must physically sit on the floor.
Realistic perspective.
Realistic shadows.
No floating furniture.
No distorted furniture.
No duplicate furniture.

DESIGN:
Create a cohesive professional interior.
Use realistic materials.
Use realistic lighting.
Use natural shadows.
Use tasteful decorations.

FINAL RESULT:
Photorealistic.
High-end interior photography.
Professionally designed.
Fully furnished.
Beautiful and realistic.

MOST IMPORTANT:
Do NOT return an empty room.
The final image MUST visibly contain furniture
appropriate for the selected room type.
`;
}

async function runReplicateModel(
  model: string,
  input: Record<string, unknown>
): Promise<string> {
  if (!REPLICATE_API_TOKEN) {
    throw new Error(
      "REPLICATE_API_TOKEN is not configured."
    );
  }

  const endpoint =
    `https://api.replicate.com/v1/models/${model}/predictions`;

  console.log(
    "================================"
  );

  console.log(
    "Replicate model:",
    model
  );

  console.log(
    "================================"
  );

  const response = await fetch(
    endpoint,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${REPLICATE_API_TOKEN}`,

        "Content-Type":
          "application/json",

        Prefer: "wait",
      },

      body: JSON.stringify({
        input,
      }),
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    console.error(
      "Replicate error:",
      response.status,
      responseText
    );

    throw new Error(
      `Replicate request failed: ${response.status}`
    );
  }

  let prediction: any;

  try {
    prediction =
      JSON.parse(responseText);
  } catch {
    throw new Error(
      "Replicate returned invalid JSON."
    );
  }

  console.log(
    "Replicate status:",
    prediction.status
  );

  if (
    prediction.status === "failed" ||
    prediction.status === "canceled"
  ) {
    throw new Error(
      `Replicate prediction ${prediction.status}: ${
        prediction.error ||
        "Unknown error"
      }`
    );
  }

  const output =
    prediction.output;

  if (!output) {
    throw new Error(
      "Replicate returned no image output."
    );
  }

  let imageUrl: string | undefined;

  if (
    typeof output === "string"
  ) {
    imageUrl = output;
  }

  if (
    !imageUrl &&
    Array.isArray(output) &&
    output.length > 0
  ) {
    const first = output[0];

    if (
      typeof first === "string"
    ) {
      imageUrl = first;
    } else if (
      first &&
      typeof first.url === "function"
    ) {
      imageUrl = first.url();
    } else if (
      first &&
      typeof first.url === "string"
    ) {
      imageUrl = first.url;
    }
  }

  if (
    !imageUrl &&
    output &&
    typeof output === "object"
  ) {
    if (
      typeof output.url === "string"
    ) {
      imageUrl = output.url;
    } else if (
      typeof output.url === "function"
    ) {
      imageUrl = output.url();
    }
  }

  if (!imageUrl) {
    throw new Error(
      "Could not extract image URL from Replicate output."
    );
  }

  if (
    !imageUrl.startsWith(
      "http://"
    ) &&
    !imageUrl.startsWith(
      "https://"
    )
  ) {
    throw new Error(
      "Replicate returned an invalid image URL."
    );
  }

  return imageUrl;
}

export async function generateRoomDesign(
  params: GenerateParams
): Promise<{
  imageUrl: string;
  modelUsed: string;
}> {
  const prompt =
    buildPrompt(params);

  console.log(
    "ROOM:",
    params.roomType
  );

  console.log(
    "STYLE:",
    params.style
  );

  console.log(
    "COLOR:",
    params.color
  );

  /*
   * PRIMARY MODEL
   */
  if (PRIMARY_MODEL) {
    try {
      const imageUrl =
        await runReplicateModel(
          PRIMARY_MODEL,
          {
            prompt,
            input_image:
              params.imageUrl,
          }
        );

      return {
        imageUrl,
        modelUsed:
          PRIMARY_MODEL,
      };
    } catch (error) {
      console.error(
        "Primary model failed:",
        error
      );
    }
  }

  /*
   * FALLBACK
   */
  const imageUrl =
    await runReplicateModel(
      FALLBACK_MODEL,
      {
        prompt,

        input_image:
          params.imageUrl,

        aspect_ratio:
          "match_input_image",

        output_format: "jpg",

        safety_tolerance: 2,

        prompt_upsampling: true,
      }
    );

  return {
    imageUrl,

    modelUsed:
      FALLBACK_MODEL,
  };
}