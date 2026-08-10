const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!;

// Your fine-tuned FLUX 2 LoRA model on Replicate, e.g. "your-username/lomar-interior-lora".
// Set this once you've trained and pushed the LoRA. Until then, generation
// falls straight through to the Kontext Pro fallback below.
const PRIMARY_MODEL = process.env.REPLICATE_LORA_MODEL; // "owner/model-name"

// Confirmed public model on Replicate — used as fallback, and as the only
// model until PRIMARY_MODEL is set.
const FALLBACK_MODEL = "black-forest-labs/flux-kontext-pro";

interface GenerateParams {
  imageUrl: string; // publicly reachable URL (e.g. a Cloudinary URL)
  style: string; // "scandinavian", "modern", ...
  roomType?: string; // "living_room", "bedroom", ...
}

function buildPrompt({ style, roomType }: GenerateParams): string {
  const room = roomType ? roomType.replace("_", " ") : "room";
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
  const response = await fetch(
    `https://api.replicate.com/v1/models/${model}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        // Ask Replicate to hold the connection open until the prediction
        // finishes (works for most FLUX models, which run in a few seconds).
        Prefer: "wait",
      },
      body: JSON.stringify({ input }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Replicate ${model} request failed: ${response.status} ${text}`);
  }

  const prediction = await response.json();

  if (prediction.status === "failed" || prediction.status === "canceled") {
    throw new Error(`Replicate ${model} prediction ${prediction.status}: ${prediction.error}`);
  }

  // Some models return a single URL, others an array — normalize.
  const output = prediction.output;
  const imageUrl = Array.isArray(output) ? output[0] : output;

  if (!imageUrl) {
    throw new Error(`Replicate ${model} returned no output`);
  }

  return imageUrl as string;
}

/**
 * Generates a redesigned room image. Tries the project's fine-tuned
 * FLUX 2 LoRA model first (if configured), and falls back to FLUX Kontext
 * Pro if that fails or isn't set up yet.
 */
export async function generateRoomDesign(params: GenerateParams): Promise<{
  imageUrl: string;
  modelUsed: string;
}> {
  const prompt = buildPrompt(params);

  if (PRIMARY_MODEL) {
    try {
      const imageUrl = await runReplicateModel(PRIMARY_MODEL, {
        prompt,
        input_image: params.imageUrl,
      });
      return { imageUrl, modelUsed: PRIMARY_MODEL };
    } catch (err) {
      console.error("Primary LoRA model failed, falling back:", err);
    }
  }

  const imageUrl = await runReplicateModel(FALLBACK_MODEL, {
    prompt,
    input_image: params.imageUrl,
  });
  return { imageUrl, modelUsed: FALLBACK_MODEL };
}
