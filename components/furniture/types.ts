export interface Furniture {
  id: string;
  name: string;
  description?: string;

  price: number;
  currency?: string;

  image_url?: string;
  product_url?: string;

  width_cm?: number;
  depth_cm?: number;
  height_cm?: number;

  brand_name?: string;
  category_name?: string;

  color?: string;

  style?: string[];
  room_type?: string[];

  rating?: number;
  review_count?: number;
}