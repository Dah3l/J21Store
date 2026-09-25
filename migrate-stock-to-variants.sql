-- ============================================
-- MIGRACIÓN DE STOCK A VARIANTES
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- PASO 1: Agregar columna stock a product_variants
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;

-- PASO 2: Migrar stock existente a las variantes
-- Distribuir el stock del producto entre sus variantes
UPDATE product_variants pv
SET stock = p.stock
FROM products p
WHERE pv.product_id = p.id;

-- PASO 3: Opcional - Eliminar la columna stock de products (descomentar si quieres)
-- ALTER TABLE products DROP COLUMN stock;

-- PASO 4: Verificar migración
SELECT 
  p.name,
  p.team,
  pv.player_name,
  pv.sizes,
  pv.stock
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
ORDER BY p.created_at DESC
LIMIT 10;
