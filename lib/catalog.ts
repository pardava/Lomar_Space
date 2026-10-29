import { supabaseAdmin as supabase } from "./supabase";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  currency?: string;
  style: string[];
  ai_style?: string[];
  colors: string[];
  rooms: string[];
  materials: string[];
  ai_product_type?: string | null;
  image_url: string | null;
  image_url_transparent?: string | null;
  product_url?: string | null;
  affiliate_url?: string | null;
  sku?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  in_stock?: boolean;
  render_ready?: boolean;
};

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  return [];
}

function mapProduct(item: any): Product {
  return {
    id: String(item.id),
    name: String(item.name ?? item.title ?? "Product"),
    category: String(item.category ?? "other"),
    price: Number(item.price ?? 0),
    currency: item.currency ?? "EUR",

    style: toArray(item.style),
    ai_style: toArray(item.ai_style),

    colors: toArray(item.ai_colors ?? item.colors),
    rooms: toArray(item.room_type ?? item.rooms),
    materials: toArray(item.ai_materials ?? item.materials),

    ai_product_type: item.ai_product_type ?? null,

    image_url: item.image_url ?? null,
    image_url_transparent: item.image_url_transparent ?? null,

    product_url: item.product_url ?? null,
    affiliate_url: item.affiliate_url ?? null,

    sku: item.sku ?? null,
    description: item.description ?? null,

    width: item.width,
    height: item.height,
    depth: item.depth,

    in_stock: item.in_stock,
    render_ready: item.render_ready,
  };
}

/* ---------------- ROOM TYPES ---------------- */

const ROOM_TYPES: Record<string, string[]> = {
  bedroom: [
    "bed",
    "bed frame",
    "box spring bed",
    "box spring bed frame",
    "upholstered bed frame",

    "nightstand",
    "bedside table",
    "side table",

    "wardrobe",
    "dresser",
    "chest of drawers",
    "cabinet",
    "sideboard",

    "bench",
    "ottoman",
    "chair",
    "armchair",

    "rug",
    "lamp",
    "table lamp",
    "floor lamp",

    "mirror",
    "artificial plant",
    "plant",
    "vase",

    "decorative pillow",
    "throw blanket",
    "curtain",
    "curtains",
    "wall art",
    "art",
    "decoration",
  ],

  living_room: [
    "sofa",
    "sectional sofa",
    "couch",

    "coffee table",
    "side table",
    "end table",

    "tv stand",
    "media console",
    "sideboard",
    "cabinet",
    "bookshelf",

    "armchair",
    "chair",
    "ottoman",
    "bench",

    "rug",
    "lamp",
    "table lamp",
    "floor lamp",

    "artificial plant",
    "plant",
    "vase",
    "mirror",
    "wall art",
    "art",
    "decoration",

    "decorative pillow",
    "throw blanket",
    "curtain",
    "curtains",
  ],

  dining_room: [
    "dining table",
    "dining chair",
    "chair",

    "sideboard",
    "cabinet",
    "console",

    "bench",
    "bar stool",
    "stool",

    "rug",
    "lamp",
    "table lamp",
    "floor lamp",

    "vase",
    "plant",
    "artificial plant",
    "mirror",
    "wall art",
    "art",
    "decoration",

    "curtain",
    "curtains",
  ],

  home_office: [
    "desk",
    "office chair",
    "chair",

    "bookshelf",
    "cabinet",
    "drawer unit",
    "filing cabinet",

    "side table",
    "shelf",

    "lamp",
    "table lamp",
    "floor lamp",

    "rug",
    "artificial plant",
    "plant",
    "vase",
    "mirror",
    "wall art",
    "art",
    "decoration",

    "curtain",
    "curtains",
  ],
};

/* ---------------- EXCLUDED ---------------- */

const EXCLUDED = [
  "mülleimer",
  "abfalleimer",
  "zahnstocher",
  "toilettenpapierhalter",
  "seifenspender",
  "grillzange",
  "pizzaschneider",
  "besteck",
  "vorratsbehälter",
  "wc-sitz",
  "toilettenbürste",
];

function isExcluded(name: string) {
  const n = name.toLowerCase();

  return EXCLUDED.some((x) => n.includes(x));
}

/* ---------------- ROOM NORMALIZATION ---------------- */

function normalizeRoom(room: string) {
  const r = room.toLowerCase();

  if (r.includes("living")) {
    return "living_room";
  }

  if (r.includes("bed")) {
    return "bedroom";
  }

  if (r.includes("dining")) {
    return "dining_room";
  }

  if (r.includes("office")) {
    return "home_office";
  }

  return r;
}

/* ---------------- TYPE MATCHING ---------------- */

function normalizeType(type: string) {
  return type
    .toLowerCase()
    .trim()
    .replace(/[_-]/g, " ");
}

function isRoomProduct(
  product: Product,
  allowedTypes: string[]
) {
  const productType = normalizeType(
    product.ai_product_type ?? ""
  );

  if (!productType) {
    return false;
  }

  return allowedTypes.some((type) => {
    const normalizedAllowed = normalizeType(type);

    return (
      productType === normalizedAllowed ||
      productType.includes(normalizedAllowed) ||
      normalizedAllowed.includes(productType)
    );
  });
}

/* ---------------- MAIN ---------------- */

export async function getCatalogCandidates(
  roomType: string,
  style: string,
  color: string,
  budget: string,
  limit = 30
): Promise<Product[]> {
  console.log("Finding furniture candidates...");

  /*
   * AI needs a large enough candidate pool.
   * We allow up to 50 products to reach the model.
   */
  const safeLimit = Math.min(
    Math.max(limit, 20),
    50
  );

  const room = normalizeRoom(roomType);

  const budgetNumber = Number(
    String(budget).replace(/[^\d.]/g, "")
  );

  /*
   * IMPORTANT:
   *
   * Do not take only the first 200 products.
   * We want to search the full active typed catalog,
   * otherwise useful lamps/decor/etc. may never reach
   * the candidate selection stage.
   */
  let query = supabase
    .from("furniture")
    .select("*")
    .eq("is_active", true)
    .not("ai_product_type", "is", null);

  if (
    Number.isFinite(budgetNumber) &&
    budgetNumber > 0
  ) {
    query = query.lte("price", budgetNumber);
  }

  /*
   * Fetch a large catalog pool.
   *
   * Supabase may have thousands of records, so we
   * intentionally use a generous limit here.
   */
  const { data, error } = await query.limit(5000);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  let products = (data ?? [])
    .filter(
      (p) => !isExcluded(p.name ?? "")
    )
    .map(mapProduct);

  console.log(
    `Active typed catalog loaded: ${products.length}`
  );

  /* ---------------- ROOM FILTER ---------------- */

  const allowedTypes =
    ROOM_TYPES[room] ??
    ROOM_TYPES["living_room"];

  const roomProducts = products.filter(
    (product) =>
      isRoomProduct(
        product,
        allowedTypes
      )
  );

  /*
   * If room filtering finds enough products,
   * use that pool.
   *
   * If not, keep the original products so AI
   * still has something to work with.
   */
  if (roomProducts.length >= 10) {
    products = roomProducts;
  }

  console.log(
    `ROOM PRODUCTS (${room}): ${products.length}`
  );

  /* ---------------- STYLE FILTER ---------------- */

  if (
    style &&
    style !== "AI decides"
  ) {
    const wanted =
      style.toLowerCase();

    const styled = products.filter(
      (p) =>
        p.ai_style?.some((s) =>
          s
            .toLowerCase()
            .includes(wanted)
        )
    );

    /*
     * Only apply style filtering when
     * enough products remain.
     */
    if (styled.length >= 20) {
      products = styled;
    }
  }

  console.log(
    `AFTER STYLE FILTER: ${products.length}`
  );

  /* ---------------- COLOR FILTER ---------------- */

  if (
    color &&
    color !== "AI decides"
  ) {
    const wanted =
      color.toLowerCase();

    const colored = products.filter(
      (p) =>
        p.colors.some((c) =>
          c
            .toLowerCase()
            .includes(wanted)
        )
    );

    /*
     * Only apply color filtering when
     * enough products remain.
     */
    if (colored.length >= 20) {
      products = colored;
    }
  }

  console.log(
    `AFTER COLOR FILTER: ${products.length}`
  );

  /* ---------------- DIVERSITY ---------------- */

  /*
   * We don't want 30 beds.
   *
   * We want a mixture such as:
   *
   * bed
   * wardrobe
   * nightstand
   * dresser
   * lamp
   * mirror
   * rug
   * decor
   * etc.
   */

  const result: Product[] = [];

  const usedTypes =
    new Set<string>();

  /*
   * First pass:
   * take products from different product types.
   */
  for (const product of products) {
    if (
      result.length >= safeLimit
    ) {
      break;
    }

    const type =
      normalizeType(
        product.ai_product_type ?? ""
      );

    if (!type) {
      continue;
    }

    if (!usedTypes.has(type)) {
      usedTypes.add(type);
      result.push(product);
    }
  }

  /*
   * Second pass:
   * if we still need more products,
   * add additional products regardless
   * of duplicate type.
   */
  if (result.length < safeLimit) {
    for (const product of products) {
      if (
        result.length >= safeLimit
      ) {
        break;
      }

      if (
        !result.some(
          (p) =>
            p.id === product.id
        )
      ) {
        result.push(product);
      }
    }
  }

  console.log(
    `Loaded ${result.length} diverse furniture candidates (room=${room})`
  );

  console.log(
    "Candidate product types:",
    result.map(
      (p) =>
        `${p.ai_product_type}: ${p.name}`
    )
  );

  return result;
}

/* ---------------- IDS ---------------- */

export async function getProductsByIds(
  ids: string[]
): Promise<Product[]> {
  if (!ids.length) {
    return [];
  }

  const { data, error } =
    await supabase
      .from("furniture")
      .select("*")
      .in("id", ids);

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (data ?? []).map(
    mapProduct
  );
}