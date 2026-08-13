-- =========================================================
-- LOMAR SPACE
-- Furniture Catalog Schema
-- =========================================================

-- UUID generation
create extension if not exists "pgcrypto";


-- =========================================================
-- BRANDS
-- =========================================================

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);


-- =========================================================
-- CATEGORIES
-- =========================================================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);


-- =========================================================
-- FURNITURE
-- =========================================================

create table if not exists furniture (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  description text,

  price numeric(10,2) not null,

  currency text not null default 'EUR',

  -- Marketplace product image
  image_url text not null,

  -- External retailer/product page
  product_url text,

  -- Dimensions in centimeters
  width_cm numeric(6,1),
  depth_cm numeric(6,1),
  height_cm numeric(6,1),

  color text,

  -- Furniture styles
  -- Example:
  -- {"scandinavian","minimalist"}
  style text[] not null default '{}',

  -- Rooms where furniture can be used
  -- Example:
  -- {"living_room","bedroom"}
  room_type text[] not null default '{}',

  -- Brand relationship
  brand_id uuid
    references brands(id)
    on delete set null,

  -- Category relationship
  category_id uuid
    references categories(id)
    on delete set null,

  -- Optional 3D model
  glb_url text,

  created_at timestamptz not null default now()
);


-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists idx_furniture_style
on furniture using gin (style);

create index if not exists idx_furniture_room_type
on furniture using gin (room_type);

create index if not exists idx_furniture_price
on furniture (price);

create index if not exists idx_furniture_category
on furniture (category_id);

create index if not exists idx_furniture_brand
on furniture (brand_id);


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table brands enable row level security;

alter table categories enable row level security;

alter table furniture enable row level security;


-- =========================================================
-- PUBLIC READ POLICIES
-- =========================================================

drop policy if exists "Public read brands"
on brands;

create policy "Public read brands"
on brands
for select
using (true);


drop policy if exists "Public read categories"
on categories;

create policy "Public read categories"
on categories
for select
using (true);


drop policy if exists "Public read furniture"
on furniture;

create policy "Public read furniture"
on furniture
for select
using (true);


-- =========================================================
-- WRITE ACCESS
-- =========================================================

-- IMPORTANT:
-- No INSERT / UPDATE / DELETE policies are created for
-- anonymous or authenticated users.
--
-- Furniture should be written through the server-side
-- admin API using SUPABASE_SERVICE_ROLE_KEY.
--
-- NEVER expose the service role key to the browser.