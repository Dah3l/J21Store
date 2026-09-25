-- Fix: Hacer la columna size nullable en la tabla products
-- Ejecutar en el SQL Editor de Supabase

-- Opción 1: Hacer size nullable (recomendado)
ALTER TABLE products 
ALTER COLUMN size DROP NOT NULL;

-- Opción 2: Establecer un valor por defecto para registros existentes
UPDATE products 
SET size = 'M' 
WHERE size IS NULL;

-- Verificar que funcionó
SELECT id, name, team, size, price 
FROM products 
ORDER BY created_at DESC 
LIMIT 5;
