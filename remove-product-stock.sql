-- Eliminar columna stock de la tabla products
-- Ya no es necesaria porque el stock se maneja por variante

ALTER TABLE products DROP COLUMN IF EXISTS stock;

-- Verificar que se eliminó
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products';
