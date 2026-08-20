-- ============================================================
-- Lomar Space — Mavjud schema'ni kengaytirish (migration)
-- Bu fayl 'furniture', 'brands', 'categories' jadvallarini
-- O'ZGARTIRMAYDI, faqat 400+ mahsulot va render pipeline uchun
-- kerakli ustunlarni QO'SHADI. Xavfsiz — mavjud ma'lumotga tegmaydi.
-- ============================================================

-- ----------------------------------------------------------
-- 1. FURNITURE jadvaliga affiliate va render uchun ustunlar
-- ----------------------------------------------------------

alter table furniture
  add column if not exists sku text unique;                    -- feed'dagi noyob kod (dublikatsiz import uchun)

alter table furniture
  add column if not exists affiliate_url text;                 -- komissiyali xarid linki (product_url mavjud, buni alohida saqlaymiz)

alter table furniture
  add column if not exists affiliate_network text;              -- 'awin' | 'cj' | 'partnerize'

alter table furniture
  add column if not exists original_price numeric(12, 2);       -- chegirmagacha narx

-- Render pipeline uchun (Cloudinary + AnyDoor)
alter table furniture
  add column if not exists image_url_transparent text;          -- fon olib tashlangan versiya

alter table furniture
  add column if not exists image_width_px integer;

alter table furniture
  add column if not exists image_height_px integer;

alter table furniture
  add column if not exists render_ready boolean not null default false;

alter table furniture
  add column if not exists last_render_check timestamptz;

-- Feed sinxronizatsiyasi va holat
alter table furniture
  add column if not exists in_stock boolean not null default true;

alter table furniture
  add column if not exists is_active boolean not null default true;

alter table furniture
  add column if not exists feed_last_synced_at timestamptz;

alter table furniture
  add column if not exists updated_at timestamptz not null default now();


-- ----------------------------------------------------------
-- 2. BRANDS jadvaliga affiliate tarmoq ma'lumotlari
-- ----------------------------------------------------------

alter table brands
  add column if not exists affiliate_network text;              -- 'awin' | 'cj' | 'partnerize'

alter table brands
  add column if not exists affiliate_advertiser_id text;        -- tarmoqdagi advertiser/program ID

alter table brands
  add column if not exists base_commission_rate numeric(5, 2);  -- masalan 5.00 = 5%


-- ----------------------------------------------------------
-- 3. Yangi indexlar (filtrlash va render query'lari uchun)
-- ----------------------------------------------------------

create index if not exists furniture_render_ready_idx
  on furniture(render_ready);

create index if not exists furniture_is_active_idx
  on furniture(is_active) where is_active = true;

create unique index if not exists furniture_sku_idx
  on furniture(sku) where sku is not null;


-- ----------------------------------------------------------
-- 4. Brendlarga affiliate tarmoq biriktirish (mavjud brendlar uchun)
-- ----------------------------------------------------------

update brands set affiliate_network = 'awin' where name in ('IKEA', 'West Elm', 'BoConcept', 'Zara Home');
update brands set affiliate_network = 'cj' where name in ('HAY', 'Muuto');

-- Yangi brendlarni qo'shish (agar kerak bo'lsa — mavjudlarga tegmaydi)
insert into brands (name, affiliate_network)
values
  ('Otto', 'awin'),
  ('Desenio', 'cj'),
  ('Wayfair', 'cj'),
  ('home24', 'awin')
on conflict (name) do nothing;


-- ============================================================
-- ESLATMA: style va room_type array ustunlaringiz allaqachon
-- to'g'ri (text[] + gin index). Ularni o'zgartirmadik — import
-- skriptida to'g'ridan-to'g'ri shu ustunlarga yozamiz, masalan:
--   style: '{"scandinavian", "minimalist"}'
--   room_type: '{"living_room"}'
-- ============================================================