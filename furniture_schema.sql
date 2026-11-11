-- Supabase `furniture` table schema for Awin catalog imports (DELIFE EU, FineBuy, PAPATYA, etc.)
-- Safe to run even if the table already exists (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

create table if not exists furniture (
  id                 uuid primary key default gen_random_uuid(),

  -- Source identifiers (used for upsert de-duplication across re-imports)
  merchant_name      text not null,
  merchant_product_id text not null,
  aw_product_id      bigint,
  ean                text,
  mpn                text,

  -- Core product info
  name               text not null,
  description        text,
  category           text,          -- merchant_category (e.g. "Stühle", "Tische")
  subcategory        text,          -- merchant_product_second_category (DELIFE only)

  -- Pricing
  price              numeric(10,2),
  currency           text default 'EUR',
  delivery_cost      numeric(10,2),
  delivery_time      text,

  -- Images
  image_url          text,          -- aw_image_url (proxied/resized), falls back to merchant_image_url
  thumb_url          text,
  alternate_images   jsonb,         -- array of extra image URLs

  -- Links
  deep_link          text,          -- aw_deep_link (affiliate tracking link, use this for outbound clicks)
  merchant_deep_link text,          -- direct merchant URL (reference only)

  -- Status
  in_stock           boolean default true,
  data_feed_id       bigint,

  created_at         timestamptz default now(),
  updated_at         timestamptz default now(),

  unique (merchant_name, merchant_product_id)
);

create index if not exists idx_furniture_category on furniture (category);
create index if not exists idx_furniture_merchant on furniture (merchant_name);
create index if not exists idx_furniture_in_stock on furniture (in_stock);

-- Keep updated_at fresh on every upsert
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_furniture_updated_at on furniture;
create trigger trg_furniture_updated_at
  before update on furniture
  for each row execute function set_updated_at();
