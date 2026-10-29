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
  category_id?: string | null;
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

// ============================================================
// Asosiy MEBEL kategoriyalari — "Shop the look" panelida
// ustuvor ko'rsatiladi (catalog.ts'dagi bilan bir xil mantiq).
// ============================================================
const CORE_FURNITURE_CATEGORIES = [
  "bed", "sofa", "wardrobe", "chair", "table", "desk", "shelf", "lamp", "rug", "mirror",
];

// ============================================================
// Mebel/dekorga ALOQASI YO'Q mahsulotlar — kengaytirilgan ro'yxat
// (yangi topilgan: neon yozuvlar, siqib chiqariladigan idish va h.k.)
// ============================================================
const EXCLUDE_KEYWORDS = [
  // Oziq-ovqat / oshxona sarf materiallari
  "mehl", "stärke", "tapioka", "besteck", "zahnstocher",
  "vorratsbehälter", "kaffeebecher", "kunststoffteller",
  "glaswaren", "cocktailgläser", "trinkglas", "geschirrtuch",
  "quetschflasche", "flasche",
  // Gigiyena / tozalash
  "shampoo-abfüllspender", "seifenspender", "gesichtstücher",
  "taschentücher", "toilettenpapierhalter", "duschschlauch",
  "geschirrspülbürste", "bürstenmann", "wc-sitz", "putzlappen",
  // Elektronika / maishiy texnika
  "mülleimer", "abfalleimer", "müllbehälter",
  // Dekorativ, lekin mebel-dizayn kontekstiga mos kelmaydigan narsalar
  "led neon", "neon schild", "neon licht",
];

function isExcluded(name: string | null | undefined): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return EXCLUDE_KEYWORDS.some((kw) => lower.includes(kw));
}

interface MatchParams {
  style?: string;
  roomType?: string;
  color?: string;
  maxBudget?: number;
  limit?: number;
}

/**
 * Kategoriyalar jadvalidan asosiy mebel toifalarining ID'larini olish.
 * catalog.ts'dagi bilan bir xil mantiq — bu yerda takrorlangan,
 * chunki bu boshqa fayl/modul (kelajakda umumiy helper'ga chiqarish
 * mumkin).
 */
async function getCoreCategoryIds(): Promise<string[]> {
  const { data: categories } = await supabase.from("categories").select("id, name");
  return (categories ?? [])
    .filter((c) => CORE_FURNITURE_CATEGORIES.includes((c.name ?? "").toLowerCase()))
    .map((c) => c.id);
}

export async function getMatchedFurniture({
  style,
  roomType,
  color,
  maxBudget,
  limit = 12,
}: MatchParams): Promise<Furniture[]> {
  const SELECT_FIELDS = `
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
      category_id,
      style,
      room_type
  `;

  function baseQuery() {
    let q = supabase.from("furniture").select(SELECT_FIELDS).eq("is_active", true);
    if (style) q = q.contains("style", [style]);
    if (roomType) q = q.contains("room_type", [roomType]);
    if (typeof maxBudget === "number") q = q.lte("price", maxBudget);
    return q;
  }

  const coreCategoryIds = await getCoreCategoryIds();

  // --- 1-bosqich: asosiy mebelni ustuvor olish ---
  let primaryRows: any[] = [];
  if (coreCategoryIds.length > 0) {
    const { data, error } = await baseQuery().in("category_id", coreCategoryIds).limit(100);
    if (error) {
      console.error("getMatchedFurniture primary error:", error);
    } else {
      primaryRows = (data ?? []).filter((row) => !isExcluded(row.name));
    }
  }

  // --- 2-bosqich: yetarli bo'lmasa, dekor/boshqa toifalar bilan to'ldirish ---
  let combinedRows: any[] = [...primaryRows];

  if (combinedRows.length < limit * 3) {
    // Ehtiyot uchun ko'proq (limit'dan 3x ko'p) yig'amiz, chunki keyin
    // rang filtri va narx saralash qo'llaniladi — yetarli tanlov bo'lishi kerak.
    const existingIds = new Set(combinedRows.map((r) => r.id));
    const { data: fillerData, error: fillerError } = await baseQuery().limit(150);

    if (!fillerError && fillerData) {
      const fillerFiltered = fillerData
        .filter((row) => !existingIds.has(row.id))
        .filter((row) => !isExcluded(row.name));
      combinedRows = combinedRows.concat(fillerFiltered);
    }
  }

  const rows = combinedRows as unknown as FurnitureRow[];

  // --- 3-bosqich: rang bo'yicha filtrlash ---
  let filteredRows = rows;
  if (color) {
    const normalizedColor = color.toLowerCase();
    const exactColorRows = filteredRows.filter((row) => {
      const rowColor = row.color?.toLowerCase() ?? "";
      return rowColor.includes(normalizedColor) || normalizedColor.includes(rowColor);
    });
    if (exactColorRows.length > 0) {
      filteredRows = exactColorRows;
    }
  }

  // --- 4-bosqich: narx bo'yicha saralash, limit qo'llash ---
  filteredRows = filteredRows
    .sort((a, b) => Number(a.price) - Number(b.price))
    .slice(0, limit);

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
    )
    .eq("is_active", true);

  if (filters.category) {
    const { data: categoryRow, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .ilike("name", filters.category)
      .maybeSingle();

    if (categoryError) {
      console.error("getFilteredFurniture category lookup error:", categoryError);
    }

    if (categoryRow?.id) {
      query = query.eq("category_id", categoryRow.id);
    } else {
      return [];
    }
  }

  if (filters.style) query = query.contains("style", [filters.style]);
  if (filters.roomType) query = query.contains("room_type", [filters.roomType]);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);

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

  const rows = (data as unknown as FurnitureRow[]).filter((row) => !isExcluded(row.name));
  return rows.map(toFurniture);
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
  const [{ data: categoryRows }, { data: furnitureRows }] = await Promise.all([
    supabase.from("categories").select("name"),
    supabase.from("furniture").select("style, room_type, color").eq("is_active", true),
  ]);

  const categories = (categoryRows ?? []).map((row) => row.name as string).filter(Boolean);

  const styleSet = new Set<string>();
  const roomSet = new Set<string>();
  const colorSet = new Set<string>();

  (furnitureRows ?? []).forEach((row) => {
    const styles = row.style as string[] | null;
    const rooms = row.room_type as string[] | null;
    const color = row.color as string | null;

    styles?.forEach((s) => s && styleSet.add(s));
    rooms?.forEach((r) => r && roomSet.add(r));
    if (color) colorSet.add(color);
  });

  return {
    categories,
    styles: Array.from(styleSet),
    rooms: Array.from(roomSet),
    colors: Array.from(colorSet),
  };
}

/**
 * Admin: create furniture
 */
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