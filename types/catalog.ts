// ============================================================
// Lomar Space — Katalog TypeScript tiplari
// MAVJUD 'furniture' schema'ga mos (array-based style/room_type)
// ============================================================

export interface Brand {
  id: string;
  name: string;
  website: string | null;
  logo_url: string | null;
  affiliate_network: 'awin' | 'cj' | 'partnerize' | null;
  affiliate_advertiser_id: string | null;
  base_commission_rate: number | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

// Loyihada ishlatiladigan style va room_type qiymatlari
// (bular array ichida erkin matn, lekin consistency uchun shu ro'yxatga rioya qilamiz)
export type StyleTag =
  | 'scandinavian'
  | 'modern'
  | 'boho'
  | 'minimalist';

export type RoomTypeTag =
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'home_office'
  | 'kids_room'
  | 'bathroom';

export interface Furniture {
  id: string;
  name: string;
  description: string | null;

  price: number;
  original_price: number | null;
  currency: string;

  image_url: string;
  product_url: string | null;

  width_cm: number | null;
  depth_cm: number | null;
  height_cm: number | null;

  brand_id: string | null;
  category_id: string | null;

  style: StyleTag[] | string[];
  room_type: RoomTypeTag[] | string[];

  // Affiliate
  sku: string | null;
  affiliate_url: string | null;
  affiliate_network: string | null;

  // Render pipeline (Cloudinary + AnyDoor)
  image_url_transparent: string | null;
  image_width_px: number | null;
  image_height_px: number | null;
  render_ready: boolean;
  last_render_check: string | null;

  // Holat
  in_stock: boolean;
  is_active: boolean;
  feed_last_synced_at: string | null;

  created_at: string;
  updated_at: string;
}

// Marketplace/render sahifasida ishlatiladigan, join qilingan mahsulot
export interface FurnitureWithRelations extends Furniture {
  brand: Brand | null;
  category: Category | null;
}

// Filtr uchun query parametrlari
export interface FurnitureFilter {
  style?: StyleTag;
  roomType?: RoomTypeTag;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  renderReadyOnly?: boolean;
}

// Affiliate feed'dan import qilinadigan xom qator (CSV/XML dan parse qilingach)
export interface RawFeedProduct {
  sku: string;
  name: string;
  description?: string;
  price: string | number;
  currency?: string;
  image_url: string;
  product_url: string; // affiliate tracking bilan
  brand_name: string;  // brands.name bilan mos kelishi kerak
  category_hint?: string; // feed'dagi kategoriya nomi, categories.name'ga map qilinadi
  width_cm?: string | number;
  height_cm?: string | number;
  depth_cm?: string | number;
}