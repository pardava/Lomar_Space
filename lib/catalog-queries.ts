import { supabaseAdmin } from "./supabaseAdmin";

export type Furniture = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string | null;
  image_url: string | null;
  product_url: string | null;
  width_cm: number | null;
  depth_cm: number | null;
  height_cm: number | null;
};

export async function getFurnitureCatalog(): Promise<Furniture[]> {
  const { data, error } = await supabaseAdmin
    .from("furniture")
    .select(`
      id,
      name,
      description,
      price,
      currency,
      image_url,
      product_url,
      width_cm,
      depth_cm,
      height_cm
    `)
    .limit(100);

  if (error) {
    console.error(
      "SUPABASE FURNITURE ERROR:",
      error
    );

    throw new Error(
      `Could not load furniture catalog: ${error.message}`
    );
  }

  return (data || []).map((item) => ({
    id: String(item.id),
    name: String(item.name || ""),
    description: item.description
      ? String(item.description)
      : null,
    price: Number(item.price || 0),
    currency: item.currency
      ? String(item.currency)
      : null,
    image_url: item.image_url
      ? String(item.image_url)
      : null,
    product_url: item.product_url
      ? String(item.product_url)
      : null,
    width_cm:
      item.width_cm != null
        ? Number(item.width_cm)
        : null,
    depth_cm:
      item.depth_cm != null
        ? Number(item.depth_cm)
        : null,
    height_cm:
      item.height_cm != null
        ? Number(item.height_cm)
        : null,
  }));
}