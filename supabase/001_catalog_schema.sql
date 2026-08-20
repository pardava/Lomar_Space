-- ============================================================
-- Lomar Space — Mebel katalogi schema
-- 400+ mahsulot: 4 style x 6 xona turi
-- ============================================================

-- 1. STYLE (dizayn uslubi) lookup jadvali
create table if not exists styles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- 'scandinavian', 'modern', 'boho', 'minimalist'
  name_en text not null,
  name_de text,
  name_uz text,
  description text,
  created_at timestamptz default now()
);

-- 2. ROOM TYPE (xona turi) lookup jadvali
create table if not exists room_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- 'living-room', 'bedroom', 'kitchen', 'home-office', 'kids-room', 'bathroom'
  name_en text not null,
  name_de text,
  name_uz text,
  created_at timestamptz default now()
);

-- 3. BRAND (IKEA, Otto, Desenio, Wayfair, home24...)
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- 'ikea', 'otto', 'desenio'
  name text not null,
  logo_url text,
  affiliate_network text,             -- 'awin', 'cj', 'partnerize'
  affiliate_advertiser_id text,       -- tarmoqdagi advertiser/program ID
  base_commission_rate numeric(5,2),  -- masalan 5.00 = 5%
  website_url text,
  created_at timestamptz default now()
);

-- 4. PRODUCT CATEGORY (divan, stol, karavot, javon...)
create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- 'sofa', 'bed', 'wardrobe', 'lighting', 'rug', 'decor'
  name_en text not null,
  name_de text,
  name_uz text
);

-- 5. ASOSIY MAHSULOT JADVALI
create table if not exists products (
  id uuid primary key default gen_random_uuid(),

  -- Asosiy ma'lumot
  name text not null,
  description text,
  sku text unique,                    -- brend ichidagi noyob kod (feed'dan keladi)

  -- Bog'lanishlar
  brand_id uuid references brands(id) on delete restrict,
  category_id uuid references product_categories(id) on delete restrict,

  -- Narx
  price numeric(10,2) not null,
  currency text default 'EUR',
  original_price numeric(10,2),       -- chegirmagacha narx (bo'lsa)

  -- Rasm va o'lchamlar (render uchun MUHIM)
  image_url text not null,            -- asosiy mahsulot rasmi (fon bilan)
  image_url_transparent text,         -- Cloudinary orqali fon olib tashlangan versiya (render uchun)
  image_width_px integer,             -- asl rasm eni (piksel)
  image_height_px integer,            -- asl rasm bo'yi (piksel)

  -- Fizik o'lchamlar (moslik tekshirish va real-scale render uchun)
  width_cm numeric(6,2),
  height_cm numeric(6,2),
  depth_cm numeric(6,2),

  -- Affiliate
  affiliate_url text not null,        -- komissiyali xarid linki
  affiliate_network text,             -- 'awin' | 'cj' | 'partnerize'

  -- Render pipeline uchun status
  render_ready boolean default false, -- image_url_transparent tayyor bo'lsa true
  last_render_check timestamptz,

  -- Meta
  in_stock boolean default true,
  is_active boolean default true,     -- vaqtincha o'chirish uchun (feed'dan yo'qolsa)
  feed_last_synced_at timestamptz,    -- affiliate feed'dan oxirgi yangilanish

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. PRODUCT <-> STYLE (many-to-many, bitta mahsulot bir nechta stylega mos bo'lishi mumkin)
create table if not exists product_styles (
  product_id uuid references products(id) on delete cascade,
  style_id uuid references styles(id) on delete cascade,
  primary key (product_id, style_id)
);

-- 7. PRODUCT <-> ROOM TYPE (many-to-many)
create table if not exists product_room_types (
  product_id uuid references products(id) on delete cascade,
  room_type_id uuid references room_types(id) on delete cascade,
  primary key (product_id, room_type_id)
);

-- ============================================================
-- INDEXLAR — tezkor filtrlash uchun (marketplace va render uchun)
-- ============================================================
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(is_active) where is_active = true;
create index if not exists idx_products_render_ready on products(render_ready);
create index if not exists idx_product_styles_style on product_styles(style_id);
create index if not exists idx_product_room_types_room on product_room_types(room_type_id);

-- ============================================================
-- BOSHLANG'ICH MA'LUMOT: 4 style x 6 xona turi
-- ============================================================
insert into styles (slug, name_en, name_de, name_uz) values
  ('scandinavian', 'Scandinavian', 'Skandinavisch', 'Skandinav uslubi'),
  ('modern', 'Modern', 'Modern', 'Zamonaviy'),
  ('boho', 'Boho', 'Boho', 'Boho'),
  ('minimalist', 'Minimalist', 'Minimalistisch', 'Minimalist')
on conflict (slug) do nothing;

insert into room_types (slug, name_en, name_de, name_uz) values
  ('living-room', 'Living Room', 'Wohnzimmer', 'Mehmonxona'),
  ('bedroom', 'Bedroom', 'Schlafzimmer', 'Yotoqxona'),
  ('kitchen', 'Kitchen', 'Küche', 'Oshxona'),
  ('home-office', 'Home Office', 'Home-Office', 'Ish xonasi'),
  ('kids-room', 'Kids Room', 'Kinderzimmer', 'Bolalar xonasi'),
  ('bathroom', 'Bathroom', 'Badezimmer', 'Hammom')
on conflict (slug) do nothing;

insert into product_categories (slug, name_en, name_de, name_uz) values
  ('sofa', 'Sofa', 'Sofa', 'Divan'),
  ('bed', 'Bed', 'Bett', 'Karavot'),
  ('table', 'Table', 'Tisch', 'Stol'),
  ('chair', 'Chair', 'Stuhl', 'Stul'),
  ('wardrobe', 'Wardrobe', 'Kleiderschrank', 'Javon'),
  ('shelving', 'Shelving', 'Regal', 'Rafcha'),
  ('lighting', 'Lighting', 'Beleuchtung', 'Yoritgich'),
  ('rug', 'Rug', 'Teppich', 'Gilam'),
  ('decor', 'Decor', 'Deko', 'Dekor'),
  ('storage', 'Storage', 'Aufbewahrung', 'Saqlash')
on conflict (slug) do nothing;

insert into brands (slug, name, affiliate_network, website_url) values
  ('ikea', 'IKEA', 'awin', 'https://www.ikea.com'),
  ('otto', 'Otto', 'awin', 'https://www.otto.de'),
  ('desenio', 'Desenio', 'cj', 'https://www.desenio.com'),
  ('wayfair', 'Wayfair', 'cj', 'https://www.wayfair.de'),
  ('home24', 'home24', 'awin', 'https://www.home24.de')
on conflict (slug) do nothing;
