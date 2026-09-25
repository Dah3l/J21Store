-- ============================================
-- CONFIGURACIÓN COMPLETA DE POLÍTICAS DE STORAGE
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- PASO 1: Eliminar políticas existentes que puedan causar conflictos
DROP POLICY IF EXISTS "Admin puede eliminar imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Solo admin puede subir imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Solo admin puede actualizar imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Lectura pública de imágenes" ON storage.objects;

-- PASO 2: Crear políticas completas para el bucket jerseys

-- Política para lectura pública (cualquiera puede ver las imágenes)
CREATE POLICY "Lectura pública de imágenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'jerseys');

-- Política para inserción (solo usuarios autenticados pueden subir)
CREATE POLICY "Solo usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jerseys');

-- Política para actualización (solo usuarios autenticados pueden actualizar)
CREATE POLICY "Solo usuarios autenticados pueden actualizar imágenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'jerseys');

-- Política para eliminación (solo usuarios autenticados pueden eliminar)
CREATE POLICY "Solo usuarios autenticados pueden eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'jerseys');

-- PASO 3: Verificar que el bucket sea público
UPDATE storage.buckets
SET public = true
WHERE name = 'jerseys';

-- PASO 4: Verificar las políticas creadas
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;

-- PASO 5: Verificar que el bucket sea público
SELECT 
  name,
  public,
  created_at
FROM storage.buckets
WHERE name = 'jerseys';
