-- ============================================
-- REESTRUCTURACIÓN COMPLETA DE LA BASE DE DATOS
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- PASO 1: Eliminar tablas y dependencias existentes (si existen)
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS delivery_zones CASCADE;
DROP TABLE IF EXISTS business_settings CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- PASO 2: Arreglar la tabla products (quitar NOT NULL de size)
ALTER TABLE products 
ALTER COLUMN size DROP NOT NULL;

-- PASO 3: Crear tabla product_variants
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 4: Crear tabla business_settings
CREATE TABLE business_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT 'J21 Store',
  whatsapp_number TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  facebook TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 5: Crear tabla delivery_zones
CREATE TABLE delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 6: Crear tabla orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 7: Habilitar RLS en todas las tablas nuevas
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- product_variants
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

-- business_settings
CREATE POLICY "Configuración visible públicamente"
  ON business_settings FOR SELECT
  USING (true);

CREATE POLICY "Solo admin puede insertar configuración"
  ON business_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar configuración"
  ON business_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar configuración"
  ON business_settings FOR DELETE
  USING (auth.role() = 'authenticated');

-- delivery_zones
CREATE POLICY "Zonas visibles públicamente"
  ON delivery_zones FOR SELECT
  USING (true);

CREATE POLICY "Solo admin puede insertar zonas"
  ON delivery_zones FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar zonas"
  ON delivery_zones FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar zonas"
  ON delivery_zones FOR DELETE
  USING (auth.role() = 'authenticated');

-- orders
CREATE POLICY "Solo admin puede ver pedidos"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Cualquiera puede crear pedidos"
  ON orders FOR INSERT
  WITH CHECK (true);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar configuración inicial
INSERT INTO business_settings (business_name, description)
VALUES ('J21 Store', 'Tu tienda de camisetas de fútbol');

-- Insertar zonas de entrega
INSERT INTO delivery_zones (name, price) VALUES
  ('La Habana Vieja', 1200),
  ('Centro Habana', 1500),
  ('Vedado', 2500),
  ('Cerro', 2500),
  ('Marianao', 3000),
  ('La Lisa', 3500),
  ('Santa Fe', 4000),
  ('Casa Blanca', 1200),
  ('Habana del Este', 1800),
  ('Cojímar', 1800),
  ('Bahía', 1000),
  ('Alamar', 2500),
  ('Guanabo', 4500),
  ('Guanabacoa', 2000),
  ('Compro Florido', 4500),
  ('Cotorro', 3000),
  ('San Miguel', 2000),
  ('Diezmero', 2500),
  ('Arroyo Naranjo', 2500),
  ('Managua', 3500),
  ('Boyeros', 4500),
  ('Santiago de las Vegas', 5000),
  ('Cujae', 2800),
  ('10 de Octubre', 2000),
  ('Luyano', 1500),
  ('Virgen del Camino', 1200);

-- Migrar productos existentes (crear variante "Genérico" con talla por defecto)
INSERT INTO product_variants (product_id, player_name, sizes)
SELECT id, 'Genérico', ARRAY[COALESCE(size, 'M')]
FROM products;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todo se creó correctamente
SELECT 'products' as tabla, COUNT(*) as total FROM products
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'business_settings', COUNT(*) FROM business_settings
UNION ALL
SELECT 'delivery_zones', COUNT(*) FROM delivery_zones;

-- Ver productos con sus variantes
SELECT 
  p.name,
  p.team,
  p.price,
  pv.player_name,
  pv.sizes
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
ORDER BY p.created_at DESC
LIMIT 10;
