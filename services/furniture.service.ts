import { supabase } from "@/lib/supabaseClient";
import type { Furniture } from "@/components/furniture/types";

// ---------- shared row shape + mapper ----------

interface FurnitureRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string;
  product_url: string | null;
  width_cm: number | null;
  depth_cm: number | null;
  height_cm: number | null;
  brands: { name: string } | null;
  categories: { name: string } | null;
}

function toFurniture(row: FurnitureRow): Furniture {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: row.price,
    currency: row.currency,
    image_url: row.image_url,
    product_url: row.product_url ?? undefined,
    width_cm: row.width_cm ?? undefined,
    depth_cm: row.depth_cm ?? undefined,
    height_cm: row.height_cm ?? undefined,
    brand_name: row.brands?.name,
    category_name: row.categories?.name,
  };
}

// ---------- AI Studio: matched furniture ----------

interface MatchParams {
  style?: string;
  roomType?: string;
  maxBudget?: number;
  limit?: number;
}

/** Furniture matching a style + room type, within budget — used by AI Studio. */
export async function getMatchedFurniture({
  style,
  roomType,
  maxBudget,
  limit = 12,
}: MatchParams): Promise<Furniture[]> {
  let query = supabase
    .from("furniture")
    .select(
      "id, name, description, price, currency, image_url, product_url, width_cm, depth_cm, height_cm, brands(name), categories(name), style, room_type"
    )
    .order("price", { ascending: true })
    .limit(limit);

  if (style) query = query.contains("style", [style]);
  if (roomType) query = query.contains("room_type", [roomType]);
  if (typeof maxBudget === "number") query = query.lte("price", maxBudget);

  const { data, error } = await query;

  if (error) {
    console.error("getMatchedFurniture error:", error);
    return [];
  }

  return (data as unknown as FurnitureRow[]).map(toFurniture);
}

// ---------- Marketplace: browse + filter ----------

export interface CatalogFilters {
  category?: string;
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest";
}

/** Furniture for the public /catalog page — plain browse + filter, no style/room requirement. */
export async function getFilteredFurniture(
  filters: CatalogFilters = {}
): Promise<Furniture[]> {
  let query = supabase
    .from("furniture")
    .select(
      "id, name, description, price, currency, image_url, product_url, width_cm, depth_cm, height_cm, brands(name), categories(name)"
    );

  if (filters.category) query = query.eq("categories.name", filters.category);
  if (filters.style) query = query.contains("style", [filters.style]);
  if (typeof filters.minPrice === "number") query = query.gte("price", filters.minPrice);
  if (typeof filters.maxPrice === "number") query = query.lte("price", filters.maxPrice);

  if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("getFilteredFurniture error:", error);
    return [];
  }

  return (data as unknown as FurnitureRow[]).map(toFurniture);
}

/** Distinct category and style values, for the catalog's filter sidebar. */
export async function getFilterOptions(): Promise<{
  categories: string[];
  styles: string[];
}> {
  const [{ data: categoryRows }, { data: styleRows }] = await Promise.all([
    supabase.from("categories").select("name"),
    supabase.from("furniture").select("style"),
  ]);

  const categories = (categoryRows ?? []).map((r) => r.name as string);
  const styleSet = new Set<string>();
  (styleRows ?? []).forEach((row) => {
    (row.style as string[] | null)?.forEach((s) => styleSet.add(s));
  });

  return { categories, styles: Array.from(styleSet) };
}

// ---------- Admin: create furniture ----------

interface CreateFurnitureInput {
  name: string;
  description: string;
  price: number;
  width_cm: number;
  depth_cm: number;
  height_cm: number;
  image_url: string;
  product_url?: string;
  brand_id: string;
  category_id: string;
  style: string[];
  room_type: string[];
  glb_url?: string;
}

/**
 * Creates a new furniture item. Goes through /api/admin/furniture (not a
 * direct Supabase write) because the anon client only has read access —
 * writes need the service role key, which only exists server-side.
 * See app/api/admin/furniture/route.ts.
 */
export async function createFurniture(input: CreateFurnitureInput) {
  const res = await fetch("/api/admin/furniture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error);
  }

  return res.json();
}
