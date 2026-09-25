-- Políticas para permitir al admin eliminar archivos del bucket
-- Ejecutar en el SQL Editor de Supabase

-- Permitir que usuarios autenticados puedan eliminar archivos del bucket jerseys
CREATE POLICY "Admin puede eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'jerseys');

-- Verificar que las políticas estén creadas
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
