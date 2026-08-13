const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

const PRIMARY_MODEL = process.env.REPLICATE_LORA_MODEL;

const FALLBACK_MODEL = "black-forest-labs/flux-kontext-pro";

interface GenerateParams {
  imageUrl: string;
  style: string;
  roomType?: string;
}

function buildPrompt({
  style,
  roomType,
}: GenerateParams): string {
  const room = roomType
    ? roomType.replace("_", " ")
    : "room";

  return (
    `Redesign this ${room} in a ${style} interior design style. ` +
    `Keep the room's structure, walls, windows, and doors exactly as they are. ` +
    `Only change furniture, decor, colors, and lighting to match the ${style} style. ` +
    `Photorealistic, high quality interior photography.`
  );
}

async function runReplicateModel(
  model: string,
  input: Record<string, unknown>
): Promise<string> {
  if (!REPLICATE_API_TOKEN) {
    throw new Error(
      "REPLICATE_API_TOKEN is not configured"
    );
  }

  const endpoint =
    `https://api.replicate.com/v1/models/${model}/predictions`;

  console.log("Replicate model:", model);
  console.log("Replicate input:", {
    ...input,
    input_image: "[image URL hidden]",
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error(
      "Replicate HTTP error:",
      response.status,
      responseText
    );

    throw new Error(
      `Replicate request failed: ${response.status} ${responseText}`
    );
  }

  let prediction: any;

  try {
    prediction = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Replicate returned invalid JSON: ${responseText}`
    );
  }

  console.log("Replicate status:", prediction.status);
  console.log("Replicate output:", prediction.output);

  if (
    prediction.status === "failed" ||
    prediction.status === "canceled"
  ) {
    throw new Error(
      `Replicate prediction ${prediction.status}: ${
        prediction.error || "Unknown error"
      }`
    );
  }

  const output = prediction.output;

  if (!output) {
    throw new Error(
      "Replicate returned no image output"
    );
  }

  let imageUrl: string | undefined;

  // String output
  if (typeof output === "string") {
    imageUrl = output;
  }

  // Array output
  if (
    !imageUrl &&
    Array.isArray(output) &&
    output.length > 0
  ) {
    const first = output[0];

    if (typeof first === "string") {
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

  // Object output
  if (
    !imageUrl &&
    output &&
    typeof output === "object"
  ) {
    if (typeof output.url === "string") {
      imageUrl = output.url;
    } else if (
      typeof output.url === "function"
    ) {
      imageUrl = output.url();
    }
  }

  if (!imageUrl) {
    throw new Error(
      `Could not extract image URL from Replicate output: ${JSON.stringify(
        output
      )}`
    );
  }

  if (
    !imageUrl.startsWith("http://") &&
    !imageUrl.startsWith("https://")
  ) {
    throw new Error(
      `Replicate returned invalid image URL: ${imageUrl}`
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
  const prompt = buildPrompt(params);

  // Try custom LoRA first
  if (PRIMARY_MODEL) {
    try {
      const imageUrl = await runReplicateModel(
        PRIMARY_MODEL,
        {
          prompt,
          input_image: params.imageUrl,
        }
      );

      return {
        imageUrl,
        modelUsed: PRIMARY_MODEL,
      };
    } catch (error) {
      console.error(
        "Primary LoRA failed. Falling back to Kontext Pro:",
        error
      );
    }
  }

  // Official FLUX Kontext Pro fallback
  const imageUrl = await runReplicateModel(
    FALLBACK_MODEL,
    {
      prompt,
      input_image: params.imageUrl,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
      prompt_upsampling: false,
    }
  );

  return {
    imageUrl,
    modelUsed: FALLBACK_MODEL,
  };
}