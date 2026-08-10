-- Lomar Space — furniture catalog schema
-- Run this in Supabase SQL editor (or as a migration)

create extension if not exists "pgcrypto";

-- Brands (IKEA, Otto, Desenio, ...)
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Categories (sofa, table, shelf, lamp, rug, bed, chair, wardrobe, decor)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Furniture catalog
create table if not exists furniture (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  currency text not null default 'EUR',
  image_url text not null,
  product_url text,               -- link to the real retailer page
  width_cm numeric(6,1),
  depth_cm numeric(6,1),
  height_cm numeric(6,1),
  color text,
  style text[] not null default '{}',        -- e.g. {"scandinavian","minimalist"}
  room_type text[] not null default '{}',    -- e.g. {"living_room","bedroom"}
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  glb_url text,                    -- optional 3D model, matches your existing form field
  created_at timestamptz not null default now()
);

create index if not exists idx_furniture_style on furniture using gin (style);
create index if not exists idx_furniture_room_type on furniture using gin (room_type);
create index if not exists idx_furniture_price on furniture (price);
create index if not exists idx_furniture_category on furniture (category_id);

-- Row Level Security: public read, writes restricted
alter table brands enable row level security;
alter table categories enable row level security;
alter table furniture enable row level security;

create policy "Public read brands" on brands for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read furniture" on furniture for select using (true);

-- Writes: only via service role (your admin panel/API), not from the browser.
-- No insert/update/delete policy is added for anon/authenticated here on purpose —
-- use the Supabase service role key server-side (e.g. in your admin API routes)
-- to write, so random visitors can't edit the catalog.
