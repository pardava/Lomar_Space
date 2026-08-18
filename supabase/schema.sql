-- ============================================
-- LOMAR SPACE DATABASE SCHEMA
-- ============================================

create extension if not exists "uuid-ossp";


-- ============================================
-- BRANDS
-- ============================================

create table if not exists brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  website text,
  logo_url text,
  created_at timestamptz not null default now()
);


-- ============================================
-- CATEGORIES
-- ============================================

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz not null default now()
);


-- ============================================
-- FURNITURE
-- ============================================

create table if not exists furniture (
  id uuid primary key default uuid_generate_v4(),

  name text not null,

  description text,

  price numeric(12, 2) not null default 0,

  currency text not null default '€',

  image_url text not null,

  product_url text,

  width_cm numeric(10, 2),
  depth_cm numeric(10, 2),
  height_cm numeric(10, 2),

  brand_id uuid references brands(id)
    on delete set null,

  category_id uuid references categories(id)
    on delete set null,

  -- Examples:
  -- {"modern", "minimalist"}
  style text[] default '{}',

  -- Examples:
  -- {"living_room", "bedroom"}
  room_type text[] default '{}',

  created_at timestamptz not null default now()
);


-- ============================================
-- INDEXES
-- ============================================

create index if not exists furniture_brand_id_idx
  on furniture(brand_id);

create index if not exists furniture_category_id_idx
  on furniture(category_id);

create index if not exists furniture_price_idx
  on furniture(price);

create index if not exists furniture_style_idx
  on furniture using gin(style);

create index if not exists furniture_room_type_idx
  on furniture using gin(room_type);

create index if not exists furniture_created_at_idx
  on furniture(created_at desc);


-- ============================================
-- SAMPLE CATEGORIES
-- ============================================

insert into categories (name)
values
  ('Sofa'),
  ('Chair'),
  ('Table'),
  ('Coffee Table'),
  ('Bed'),
  ('Nightstand'),
  ('Wardrobe'),
  ('Desk'),
  ('Dining Table'),
  ('Dining Chair'),
  ('Lighting'),
  ('Rug'),
  ('Storage'),
  ('Decor')
on conflict (name) do nothing;


-- ============================================
-- SAMPLE BRANDS
-- ============================================

insert into brands (name)
values
  ('IKEA'),
  ('West Elm'),
  ('HAY'),
  ('Muuto'),
  ('BoConcept'),
  ('Zara Home')
on conflict (name) do nothing;


-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table brands enable row level security;
alter table categories enable row level security;
alter table furniture enable row level security;


-- ============================================
-- PUBLIC READ ACCESS
-- ============================================

drop policy if exists "Public can view brands"
on brands;

create policy "Public can view brands"
on brands
for select
using (true);


drop policy if exists "Public can view categories"
on categories;

create policy "Public can view categories"
on categories
for select
using (true);


drop policy if exists "Public can view furniture"
on furniture;

create policy "Public can view furniture"
on furniture
for select
using (true);


-- ============================================
-- DONE
-- ============================================