import { supabase } from "@/lib/supabaseClient";
import type { Furniture } from "@/components/furniture/types";

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
  color: string | null;
  brands: { name: string } | null;
  categories: { name: string } | null;
  style?: string[] | null;
  room_type?: string[] | null;
}

function toFurniture(row: FurnitureRow): Furniture {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
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

interface MatchParams {
  style?: string;
  roomType?: string;
  color?: string;
  maxBudget?: number;
  limit?: number;
}

export async function getMatchedFurniture({
  style,
  roomType,
  color,
  maxBudget,
  limit = 12,
}: MatchParams): Promise<Furniture[]> {
  let query = supabase
    .from("furniture")
    .select(
      `
      id,
      name,
      description,
      price,
      currency,
      image_url,
      product_url,
      width_cm,
      depth_cm,
      height_cm,
      color,
      brands(name),
      categories(name),
      style,
      room_type
      `
    );

  /*
   * STYLE
   */
  if (style) {
    query = query.contains("style", [style]);
  }

  /*
   * ROOM TYPE
   */
  if (roomType) {
    query = query.contains("room_type", [roomType]);
  }

  /*
   * INDIVIDUAL PRODUCT PRICE
   */
  if (typeof maxBudget === "number") {
    query = query.lte("price", maxBudget);
  }

  /*
   * Get more than needed first.
   *
   * Color is handled after Supabase because
   * we want a fallback if exact color doesn't exist.
   */
  query = query
    .order("price", { ascending: true })
    .limit(50);

  const { data, error } = await query;

  if (error) {
    console.error("getMatchedFurniture error:", error);
    return [];
  }

  const rows = (data ?? []) as FurnitureRow[];

  /*
   * COLOR MATCHING
   */
  let filteredRows = rows;

  if (color) {
    const normalizedColor = color.toLowerCase();

    const exactColorRows = rows.filter((row) => {
      const rowColor = row.color?.toLowerCase() ?? "";

      return (
        rowColor.includes(normalizedColor) ||
        normalizedColor.includes(rowColor)
      );
    });

    /*
     * If exact color exists, prefer it.
     * Otherwise keep style + room results.
     */
    if (exactColorRows.length > 0) {
      filteredRows = exactColorRows;
    }
  }

  /*
   * LIMIT
   */
  filteredRows = filteredRows.slice(0, limit);

  return filteredRows.map(toFurniture);
}

/**
 * Public catalog filters
 */
export interface CatalogFilters {
  category?: string;
  style?: string;
  roomType?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest";
}

export async function getFilteredFurniture(
  filters: CatalogFilters = {}
): Promise<Furniture[]> {
  let query = supabase.from("furniture").select(
    `
      id,
      name,
      description,
      price,
      currency,
      image_url,
      product_url,
      width_cm,
      depth_cm,
      height_cm,
      color,
      brands(name),
      categories(name),
      style,
      room_type
      `
  );

  if (filters.style) {
    query = query.contains("style", [filters.style]);
  }

  if (filters.roomType) {
    query = query.contains("room_type", [filters.roomType]);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("getFilteredFurniture error:", error);
    return [];
  }

  return (data as FurnitureRow[]).map(toFurniture);
}

/**
 * Filter options
 */
export async function getFilterOptions(): Promise<{
  categories: string[];
  styles: string[];
  rooms: string[];
  colors: string[];
}> {
  const [
    { data: categoryRows },
    { data: furnitureRows },
  ] = await Promise.all([
    supabase.from("categories").select("name"),
    supabase
      .from("furniture")
      .select("style, room_type, color"),
  ]);

  const categories = (categoryRows ?? [])
    .map((row) => row.name as string)
    .filter(Boolean);

  const styleSet = new Set<string>();
  const roomSet = new Set<string>();
  const colorSet = new Set<string>();

  (furnitureRows ?? []).forEach((row) => {
    const styles = row.style as string[] | null;
    const rooms = row.room_type as string[] | null;
    const color = row.color as string | null;

    styles?.forEach((style) => {
      if (style) {
        styleSet.add(style);
      }
    });

    rooms?.forEach((room) => {
      if (room) {
        roomSet.add(room);
      }
    });

    if (color) {
      colorSet.add(color);
    }
  });

  return {
    categories,
    styles: Array.from(styleSet),
    rooms: Array.from(roomSet),
    colors: Array.from(colorSet),
  };
}