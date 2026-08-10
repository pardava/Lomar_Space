export interface Furniture {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string; // defaults to "EUR"
  image_url: string;
  width_cm?: number;
  depth_cm?: number;
  height_cm?: number;
  brand_name?: string;
  category_name?: string;
  product_url?: string; // link to the real retailer product page
  rating?: number; // optional — only set this from real review data, never fabricate
  review_count?: number;
}
