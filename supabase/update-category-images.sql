-- =========================================================
-- UPDATE EXISTING FURNITURE CATEGORIES + IMAGE
-- =========================================================

-- KALLAX
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'shelf'
  )
WHERE name = 'KALLAX Shelving unit';


-- POÄNG
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'chair'
  )
WHERE name = 'POÄNG Armchair';


-- LACK
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'table'
  )
WHERE name = 'LACK Coffee table';


-- HEMNES
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'bed'
  )
WHERE name = 'HEMNES Bed frame';


-- RANARP
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'lamp'
  )
WHERE name = 'RANARP Floor lamp';


-- BILLY
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'shelf'
  )
WHERE name = 'BILLY Bookcase';


-- VITTSJÖ
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'table'
  )
WHERE name = 'VITTSJÖ Console table';


-- EKET
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'shelf'
  )
WHERE name = 'EKET Wall cabinet';


-- FLINTAN
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'chair'
  )
WHERE name = 'FLINTAN Office chair';


-- STOCKHOLM
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'rug'
  )
WHERE name = 'STOCKHOLM Rug, flatwoven';


-- FADO
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'lamp'
  )
WHERE name = 'FADO Table lamp';


-- PAX
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'wardrobe'
  )
WHERE name = 'PAX Wardrobe';


-- LANDSKRONA
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'sofa'
  )
WHERE name = 'LANDSKRONA Sofa';


-- MALM
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'bed'
  )
WHERE name = 'MALM Bed frame';


-- NORDVIKEN
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'table'
  )
WHERE name = 'NORDVIKEN Dining table';


-- SINNERLIG
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'lamp'
  )
WHERE name = 'SINNERLIG Pendant lamp';


-- SÖDERHAMN
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'sofa'
  )
WHERE name = 'SÖDERHAMN Sofa';


-- JASSA
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'decor'
  )
WHERE name = 'JASSA Basket';


-- FEJKA
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'decor'
  )
WHERE name = 'FEJKA Artificial plant';


-- SANELA
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'decor'
  )
WHERE name = 'SANELA Curtains';


-- SKOGSFRU
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'chair'
  )
WHERE name = 'SKOGSFRU Rattan chair';


-- VELVET CHAIR
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'chair'
  )
WHERE name = 'Velvet accent armchair';


-- BOTANICAL PRINTS
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'decor'
  )
WHERE name = 'Botanical print set of 2';


-- KNIT THROW
UPDATE furniture
SET
  image_url = '/placeholder-furniture.svg',
  category_id = (
    SELECT id FROM categories WHERE name = 'decor'
  )
WHERE name = 'Chunky knit throw blanket';
