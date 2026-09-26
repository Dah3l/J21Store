-- Agregar campo de precio original (antes de oferta) a products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS original_price INTEGER;

-- Los productos existentes mantendrán su precio actual como precio de oferta
-- y original_price será NULL (sin oferta)

-- Verificar cambios
SELECT id, name, price, original_price
FROM products
ORDER BY created_at DESC
LIMIT 10;
