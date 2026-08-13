-- LOMAR SPACE
-- Furniture catalog seed
-- Version 1: existing 24-product catalog

-- =========================================================
-- 1. BRANDS
-- =========================================================

INSERT INTO brands (name)
VALUES
  ('IKEA'),
  ('Otto'),
  ('Desenio'),
  ('Wayfair')
ON CONFLICT (name) DO NOTHING;


-- =========================================================
-- 2. CATEGORIES
-- =========================================================

INSERT INTO categories (name)
VALUES
  ('sofa'),
  ('table'),
  ('shelf'),
  ('lamp'),
  ('rug'),
  ('bed'),
  ('chair'),
  ('wardrobe'),
  ('decor')
ON CONFLICT (name) DO NOTHING;


-- =========================================================
-- 3. FURNITURE
-- =========================================================

INSERT INTO furniture (
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
  style,
  room_type,
  brand_id,
  category_id
)

SELECT
  v.name,
  v.description,
  v.price,
  'EUR',
  v.image_url,
  v.product_url,
  v.width_cm,
  v.depth_cm,
  v.height_cm,
  v.color,
  v.style::text[],
  v.room_type::text[],

  (
    SELECT id
    FROM brands
    WHERE name = v.brand
  ),

  (
    SELECT id
    FROM categories
    WHERE name = v.category
  )

FROM (
  VALUES

  -- =======================================================
  -- SCANDINAVIAN
  -- =======================================================

  (
    'KALLAX Shelving unit',
    'Cube storage shelf, freestanding or wall-mounted.',
    79.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/kallax-regale-58285/',
    77.0,
    39.0,
    147.0,
    'white',
    ARRAY['scandinavian','minimalist'],
    ARRAY['living_room','bedroom'],
    'IKEA',
    'shelf'
  ),

  (
    'POÄNG Armchair',
    'Bentwood frame armchair with cushion.',
    129.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/sessel-fst003/',
    68.0,
    82.0,
    100.0,
    'birch/beige',
    ARRAY['scandinavian'],
    ARRAY['living_room'],
    'IKEA',
    'chair'
  ),

  (
    'LACK Coffee table',
    'Lightweight board-on-frame coffee table.',
    24.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/couchtische-10705/',
    90.0,
    55.0,
    45.0,
    'white',
    ARRAY['scandinavian','minimalist'],
    ARRAY['living_room'],
    'IKEA',
    'table'
  ),

  (
    'HEMNES Bed frame',
    'Solid pine bed frame.',
    219.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/betten-bm003/',
    166.0,
    211.0,
    118.0,
    'white stain',
    ARRAY['scandinavian'],
    ARRAY['bedroom'],
    'IKEA',
    'bed'
  ),

  (
    'RANARP Floor lamp',
    'Adjustable metal floor lamp.',
    49.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/stehleuchten-10731/',
    30.0,
    30.0,
    141.0,
    'black',
    ARRAY['scandinavian','modern'],
    ARRAY['living_room','bedroom'],
    'IKEA',
    'lamp'
  ),

  (
    'BILLY Bookcase',
    'Classic adjustable-shelf bookcase.',
    69.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/buecherregale-10475/',
    80.0,
    28.0,
    202.0,
    'white',
    ARRAY['scandinavian','minimalist'],
    ARRAY['living_room'],
    'IKEA',
    'shelf'
  ),


  -- =======================================================
  -- MINIMALIST
  -- =======================================================

  (
    'VITTSJÖ Console table',
    'Glass and metal console table.',
    59.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/beistelltische-19148/',
    100.0,
    36.0,
    74.0,
    'black/glass',
    ARRAY['minimalist','modern'],
    ARRAY['living_room'],
    'IKEA',
    'table'
  ),

  (
    'EKET Wall cabinet',
    'Minimal modular wall storage.',
    35.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/eket-38956/',
    35.0,
    25.0,
    35.0,
    'white',
    ARRAY['minimalist'],
    ARRAY['living_room','bedroom'],
    'IKEA',
    'shelf'
  ),

  (
    'FLINTAN Office chair',
    'Adjustable minimalist office chair.',
    89.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/buerostuehle-20658/',
    68.0,
    68.0,
    121.0,
    'black',
    ARRAY['minimalist','modern'],
    ARRAY['office'],
    'IKEA',
    'chair'
  ),

  (
    'STOCKHOLM Rug, flatwoven',
    'Handwoven wool rug.',
    199.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/teppiche-20492/',
    170.0,
    240.0,
    1.0,
    'beige',
    ARRAY['minimalist','scandinavian'],
    ARRAY['living_room'],
    'IKEA',
    'rug'
  ),

  (
    'FADO Table lamp',
    'Soft-glow frosted glass table lamp.',
    19.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/tischleuchten-10733/',
    15.0,
    15.0,
    19.0,
    'white',
    ARRAY['minimalist'],
    ARRAY['bedroom','living_room'],
    'IKEA',
    'lamp'
  ),

  (
    'PAX Wardrobe',
    'Modular sliding-door wardrobe.',
    340.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/pax-system-24473/',
    150.0,
    60.0,
    236.0,
    'white',
    ARRAY['minimalist','modern'],
    ARRAY['bedroom'],
    'IKEA',
    'wardrobe'
  ),


  -- =======================================================
  -- MODERN
  -- =======================================================

  (
    'LANDSKRONA Sofa',
    '3-seat sofa with wood legs.',
    699.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/sofas-fu003/',
    213.0,
    89.0,
    78.0,
    'grey',
    ARRAY['modern'],
    ARRAY['living_room'],
    'IKEA',
    'sofa'
  ),

  (
    'MALM Bed frame',
    'Veneer bed frame, clean lines.',
    179.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/betten-bm003/',
    156.0,
    209.0,
    100.0,
    'black-brown',
    ARRAY['modern','minimalist'],
    ARRAY['bedroom'],
    'IKEA',
    'bed'
  ),

  (
    'NORDVIKEN Dining table',
    'Solid birch extendable table.',
    279.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/esstische-17470/',
    152.0,
    95.0,
    75.0,
    'white',
    ARRAY['modern'],
    ARRAY['dining_room'],
    'IKEA',
    'table'
  ),

  (
    'SINNERLIG Pendant lamp',
    'Bamboo pendant lamp.',
    89.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/pendelleuchten-10730/',
    37.0,
    37.0,
    32.0,
    'natural',
    ARRAY['modern','boho'],
    ARRAY['living_room','dining_room'],
    'IKEA',
    'lamp'
  ),

  (
    'SÖDERHAMN Sofa',
    'Deep-seat modular sofa.',
    890.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/sofas-fu003/',
    250.0,
    99.0,
    83.0,
    'green',
    ARRAY['modern'],
    ARRAY['living_room'],
    'IKEA',
    'sofa'
  ),


  -- =======================================================
  -- BOHO
  -- =======================================================

  (
    'JASSA Basket',
    'Handwoven banana-fibre storage basket.',
    29.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/koerbe-20492/',
    47.0,
    36.0,
    25.0,
    'natural',
    ARRAY['boho','scandinavian'],
    ARRAY['living_room','bedroom'],
    'IKEA',
    'decor'
  ),

  (
    'FEJKA Artificial plant',
    'Potted artificial plant.',
    14.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/kunstpflanzen-25291/',
    30.0,
    30.0,
    60.0,
    'green',
    ARRAY['boho','scandinavian'],
    ARRAY['living_room','bedroom'],
    'IKEA',
    'decor'
  ),

  (
    'SANELA Curtains',
    'Heavy velvet curtains, 1 pair.',
    69.99,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/gardinen-16238/',
    140.0,
    300.0,
    1.0,
    'terracotta',
    ARRAY['boho'],
    ARRAY['living_room','bedroom'],
    'IKEA',
    'decor'
  ),

  (
    'SKOGSFRU Rattan chair',
    'Rattan and steel accent chair.',
    149.00,
    '/placeholder-furniture.svg',
    'https://www.ikea.com/de/de/cat/sessel-fst003/',
    68.0,
    70.0,
    76.0,
    'natural rattan',
    ARRAY['boho'],
    ARRAY['living_room'],
    'IKEA',
    'chair'
  ),


  -- =======================================================
  -- LUXURY / ACCENT
  -- =======================================================

  (
    'Velvet accent armchair',
    'Curved velvet accent chair.',
    349.00,
    '/placeholder-furniture.svg',
    'https://www.otto.de/',
    75.0,
    80.0,
    90.0,
    'emerald',
    ARRAY['luxury','modern'],
    ARRAY['living_room'],
    'Otto',
    'chair'
  ),

  (
    'Botanical print set of 2',
    'Framed botanical wall art, set of 2.',
    79.00,
    '/placeholder-furniture.svg',
    'https://desenio.com/',
    30.0,
    2.0,
    40.0,
    'multi',
    ARRAY['scandinavian','minimalist'],
    ARRAY['living_room','bedroom'],
    'Desenio',
    'decor'
  ),

  (
    'Chunky knit throw blanket',
    'Oversized hand-knit throw.',
    89.00,
    '/placeholder-furniture.svg',
    'https://www.wayfair.com/',
    130.0,
    150.0,
    1.0,
    'cream',
    ARRAY['scandinavian','boho'],
    ARRAY['living_room','bedroom'],
    'Wayfair',
    'decor'
  )

) AS v(
  name,
  description,
  price,
  image_url,
  product_url,
  width_cm,
  depth_cm,
  height_cm,
  color,
  style,
  room_type,
  brand,
  category
);