-- Agregar campo para identificar productos por encargo
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_preorder BOOLEAN DEFAULT false;

-- Agregar campo para tiempo estimado de entrega (en días)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS delivery_days INTEGER DEFAULT 7;

-- Actualizar productos existentes (todos son stock normal por defecto)
UPDATE products SET is_preorder = false WHERE is_preorder IS NULL;

-- Verificar cambios
SELECT id, name, team, is_preorder, delivery_days
FROM products
ORDER BY created_at DESC
LIMIT 10;
