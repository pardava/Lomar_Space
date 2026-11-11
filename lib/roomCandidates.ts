import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "./catalog";

type Slot = {
  types: string[]; // ai_product_type values (lowercase)
  n: number; // how many candidates to offer for this slot
  required?: boolean; // log a warning when nothing is found
};

type RoomConfig = {
  slots: Slot[];
  rules: string; // goes into both the analysis prompt and the render prompt
};

export const ROOM_CONFIG: Record<string, RoomConfig> = {
  bedroom: {
    slots: [
      { types: ["bed frame", "box spring bed", "box spring bed frame"], n: 2, required: true },
      { types: ["nightstand"], n: 2, required: true },
      { types: ["rug"], n: 2 },
      { types: ["table lamp", "floor lamp"], n: 2 },
      { types: ["vase", "artificial plant", "mirror"], n: 2 },
      { types: ["cabinet", "lowboard", "wardrobe", "dresser"], n: 1 },
    ],
    rules:
      "For a bedroom always select one bed, one nightstand, one rug, one lamp and one decor item (vase, plant or mirror) when such candidates exist. Place the nightstand TWICE, one on each side of the bed. Put the lamp on a nightstand. Add a cabinet or dresser only if there is clearly space for it.",
  },

  living_room: {
    slots: [
      { types: ["sofa", "corner sofa", "sectional sofa", "modular sofa"], n: 3, required: true },
      { types: ["coffee table"], n: 2, required: true },
      { types: ["armchair"], n: 2 },
      { types: ["sideboard", "tv stand", "lowboard"], n: 2 },
      { types: ["rug"], n: 2 },
      { types: ["floor lamp", "table lamp"], n: 2 },
      { types: ["vase", "artificial plant", "mirror", "pouf"], n: 2 },
    ],
    rules:
      "For a living room always select one sofa, one coffee table, one rug and one lamp when such candidates exist. Add an armchair, a storage piece (sideboard or TV stand) and one decor item when they fit. Place the rug under the sofa and coffee table.",
  },

  dining_room: {
    slots: [
      { types: ["dining table"], n: 3, required: true },
      { types: ["dining chair", "chair"], n: 3, required: true },
      { types: ["sideboard", "lowboard"], n: 2 },
      { types: ["rug"], n: 1 },
      { types: ["ceiling lamp", "floor lamp"], n: 2 },
      { types: ["vase", "mirror", "artificial plant"], n: 2 },
    ],
    rules:
      "For a dining room always select one dining table and one chair model. Repeat the same chair 4 to 6 times around the table. Add a sideboard, a lamp and one decor item when such candidates exist.",
  },

  office: {
    slots: [
      { types: ["desk", "height adjustable desk"], n: 3, required: true },
      { types: ["office chair", "swivel chair"], n: 3, required: true },
      { types: ["bookshelf", "cabinet"], n: 2 },
      { types: ["table lamp", "floor lamp"], n: 2 },
      { types: ["rug", "artificial plant", "vase"], n: 2 },
    ],
    rules:
      "For an office always select one desk, one office chair, one shelf and one lamp when such candidates exist. Add one decor item.",
  },
};

// The catalog has no kitchen cabinets, so the kitchen uses the dining setup.
ROOM_CONFIG.kitchen = ROOM_CONFIG.dining_room;

function normalizeRoom(room: string): string {
  const key = (room || "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");

  return ROOM_CONFIG[key] ? key : "living_room";
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function parseBudget(budget: string): number | null {
  const n = parseFloat(String(budget ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * One loader for every room type. Pass your existing Supabase server client.
 * Run this once in Supabase first:
 *   update furniture set ai_product_type = lower(ai_product_type)
 *   where ai_product_type <> lower(ai_product_type);
 */
export async function loadCandidates(
  supabase: SupabaseClient,
  room: string,
  budget: string = ""
): Promise<{ candidates: Product[]; rules: string; room: string }> {
  const roomKey = normalizeRoom(room);
  const cfg = ROOM_CONFIG[roomKey];
  const maxPrice = parseBudget(budget);

  const groups = await Promise.all(
    cfg.slots.map(async (slot) => {
      let query = supabase
        .from("furniture")
        .select("*")
        .eq("is_active", true)
        .in("ai_product_type", slot.types)
        .like("image_url", "http%")
        .limit(40);

      if (maxPrice) {
        query = query.lte("price", maxPrice);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Candidate query failed for [${slot.types.join(", ")}]:`, error.message);
        return [] as Product[];
      }

      const picked = shuffle((data ?? []) as Product[]).slice(0, slot.n);

      if (!picked.length && slot.required) {
        console.warn(`No candidates found for required slot: ${slot.types.join(", ")}`);
      }

      return picked;
    })
  );

  // Remove duplicates by id
  const seen = new Set<string>();
  const candidates = groups.flat().filter((p) => {
    const id = String(p.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  console.log(
    `Loaded ${candidates.length} slot-based candidates (room=${roomKey}):`,
    candidates.map((p) => `${(p as any).ai_product_type}: ${p.name}`)
  );

  return { candidates, rules: cfg.rules, room: roomKey };
}