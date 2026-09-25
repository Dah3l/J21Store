-- Script para migrar el sistema de productos a variantes (jugadores + tallas)
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear tabla de variantes de producto
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de seguridad
CREATE POLICY "Variantes visibles públicamente"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Solo admin puede insertar variantes"
  ON product_variants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar variantes"
  ON product_variants FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar variantes"
  ON product_variants FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. Migrar productos existentes (convertir size a una variante por defecto)
INSERT INTO product_variants (product_id, player_name, sizes)
SELECT id, 'Genérico', ARRAY[size] 
FROM products 
WHERE size IS NOT NULL AND size != '';

-- 5. Opcional: Eliminar la columna size de products (descomentar si quieres)
-- ALTER TABLE products DROP COLUMN size;

-- 6. Verificar migración
SELECT 
  p.name,
  p.team,
  pv.player_name,
  pv.sizes
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
ORDER BY p.created_at DESC
LIMIT 10;
