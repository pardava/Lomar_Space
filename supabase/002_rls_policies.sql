-- ============================================================
-- Row Level Security — katalog jadvallari uchun
-- Mahsulotlar hammaga ochiq o'qish uchun, faqat admin yozishi mumkin
-- ============================================================

alter table styles enable row level security;
alter table room_types enable row level security;
alter table brands enable row level security;
alter table product_categories enable row level security;
alter table products enable row level security;
alter table product_styles enable row level security;
alter table product_room_types enable row level security;

-- Hammaga o'qish ruxsati (public marketplace uchun)
create policy "Public read styles" on styles for select using (true);
create policy "Public read room_types" on room_types for select using (true);
create policy "Public read brands" on brands for select using (true);
create policy "Public read product_categories" on product_categories for select using (true);
create policy "Public read active products" on products for select using (is_active = true);
create policy "Public read product_styles" on product_styles for select using (true);
create policy "Public read product_room_types" on product_room_types for select using (true);

-- Faqat service_role (backend/admin) yozishi mumkin
-- (import skriptlari service_role key bilan ishlaydi, bu policylarni bypass qiladi)
