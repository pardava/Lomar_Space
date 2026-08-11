-- Lomar Space — bulk update category images
-- Replace each 'PASTE_..._URL_HERE' with a real Unsplash image URL
-- (right-click a photo on unsplash.com -> Copy image address).
-- Then run this whole script once in Supabase SQL Editor.

update furniture set image_url = 'PASTE_SOFA_URL_HERE'
where category_id = (select id from categories where name = 'sofa');

update furniture set image_url = 'PASTE_CHAIR_URL_HERE'
where category_id = (select id from categories where name = 'chair');

update furniture set image_url = 'PASTE_TABLE_URL_HERE'
where category_id = (select id from categories where name = 'table');

update furniture set image_url = 'PASTE_BED_URL_HERE'
where category_id = (select id from categories where name = 'bed');

update furniture set image_url = 'PASTE_SHELF_URL_HERE'
where category_id = (select id from categories where name = 'shelf');

update furniture set image_url = 'PASTE_LAMP_URL_HERE'
where category_id = (select id from categories where name = 'lamp');

update furniture set image_url = 'PASTE_DECOR_URL_HERE'
where category_id = (select id from categories where name = 'decor');

update furniture set image_url = 'PASTE_RUG_URL_HERE'
where category_id = (select id from categories where name = 'rug');
