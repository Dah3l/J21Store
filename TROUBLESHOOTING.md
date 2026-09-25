# 🔧 Troubleshooting: Eliminación de Imágenes del Storage

## ✅ Build Exitoso

El código se ha compilado correctamente con logs de debugging agregados.

## 📋 Pasos para Verificar y Solucionar el Problema

### 1. Ejecutar el Script SQL de Políticas

**Importante:** Ejecuta este script en el **SQL Editor** de Supabase:

```sql
-- Archivo: fix-storage-policies.sql

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Admin puede eliminar imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Solo admin puede subir imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Solo admin puede actualizar imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Lectura pública de imágenes" ON storage.objects;

-- Crear políticas correctas
CREATE POLICY "Lectura pública de imágenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'jerseys');

CREATE POLICY "Solo usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jerseys');

CREATE POLICY "Solo usuarios autenticados pueden actualizar imágenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'jerseys');

CREATE POLICY "Solo usuarios autenticados pueden eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'jerseys');

-- Asegurar que el bucket sea público
UPDATE storage.buckets
SET public = true
WHERE name = 'jerseys';
```

### 2. Verificar las Políticas en Supabase

1. Ve a tu proyecto en Supabase
2. Navega a **Storage** → **Policies**
3. Busca el bucket `jerseys`
4. Verifica que existan estas 4 políticas:
   - ✅ `Lectura pública de imágenes` (SELECT)
   - ✅ `Solo usuarios autenticados pueden subir imágenes` (INSERT)
   - ✅ `Solo usuarios autenticados pueden actualizar imágenes` (UPDATE)
   - ✅ `Solo usuarios autenticados pueden eliminar imágenes` (DELETE)

### 3. Probar con la Consola del Navegador

1. Abre tu aplicación en el navegador
2. Presiona **F12** para abrir las Developer Tools
3. Ve a la pestaña **Console**
4. Inicia sesión como admin
5. Intenta eliminar un producto con imagen
6. **Observa los logs en la consola:**

```
Eliminando producto con ID: xxx-xxx-xxx
Producto a eliminar: {id: "...", name: "...", image_url: "https://..."}
Producto tiene imagen, intentando eliminar del storage
Intentando eliminar imagen: https://xxx.supabase.co/storage/v1/object/public/jerseys/products/xxx.jpg
Extracting file path: {url: "https://...", filePath: "products/xxx.jpg"}
Eliminando archivo del storage: products/xxx.jpg
Imagen eliminada exitosamente: [...]
Producto eliminado exitosamente de la base de datos
```

### 4. Posibles Errores y Soluciones

#### Error: "new row violates row-level security policy"

**Causa:** Las políticas de storage no están configuradas correctamente.

**Solución:**
1. Ejecuta el script `fix-storage-policies.sql`
2. Verifica que las políticas existan en Supabase
3. Asegúrate de que el bucket `jerseys` sea público

#### Error: "The resource could not be found"

**Causa:** El archivo ya no existe en el storage o la URL es incorrecta.

**Solución:**
1. Verifica que la URL de la imagen sea correcta
2. Revisa que el archivo exista en Supabase Storage
3. Los logs mostrarán el path extraído para verificar

#### Error: "Permission denied"

**Causa:** El usuario no tiene permisos para eliminar archivos.

**Solución:**
1. Verifica que estés logueado como admin
2. Ejecuta el script SQL de políticas
3. Verifica que la política DELETE tenga `TO authenticated`

### 5. Verificar que el Bucket sea Público

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT name, public, created_at
FROM storage.buckets
WHERE name = 'jerseys';
```

Debe mostrar `public = true`.

### 6. Verificar las Políticas Creadas

Ejecuta esta consulta en el SQL Editor:

```sql
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
```

Debes ver las 4 políticas mencionadas arriba.

## 🎯 Flujo Esperado

### Al Eliminar un Producto:

1. **Usuario hace clic en "Eliminar"**
2. **Sistema muestra confirmación:** "¿Eliminar este producto?"
3. **Usuario confirma**
4. **Sistema ejecuta:**
   ```javascript
   console.log('Eliminando producto con ID:', id);
   console.log('Producto a eliminar:', productToDelete);
   console.log('Producto tiene imagen, intentando eliminar del storage');
   ```
5. **Sistema extrae el path:**
   ```javascript
   console.log('Extracting file path:', { url, filePath });
   ```
6. **Sistema elimina del storage:**
   ```javascript
   console.log('Eliminando archivo del storage:', filePath);
   ```
7. **Sistema confirma eliminación:**
   ```javascript
   console.log('Imagen eliminada exitosamente:', data);
   ```
8. **Sistema elimina de la base de datos:**
   ```javascript
   console.log('Producto eliminado exitosamente de la base de datos');
   ```

## 🔍 Debugging Avanzado

### Verificar la URL de la Imagen

La URL debe tener este formato:
```
https://TU-PROYECTO.supabase.co/storage/v1/object/public/jerseys/products/1234567890-abc.jpg
```

El path extraído debe ser:
```
products/1234567890-abc.jpg
```

### Verificar el Bucket

1. Ve a **Storage** en Supabase
2. Haz clic en el bucket `jerseys`
3. Verifica que el archivo exista en la carpeta `products/`
4. Copia la URL pública y compárala con la que muestra el log

### Probar Manualmente

Puedes probar la eliminación manualmente desde la consola del navegador:

```javascript
// Obtener el cliente de Supabase
const supabase = window.supabase;

// Eliminar un archivo
const { data, error } = await supabase.storage
  .from('jerseys')
  .remove(['products/nombre-del-archivo.jpg']);

console.log('Data:', data);
console.log('Error:', error);
```

## 📞 Si el Problema Persiste

1. **Copia los logs completos de la consola**
2. **Verifica las políticas en Supabase**
3. **Asegúrate de que el bucket sea público**
4. **Verifica que estés logueado como admin**
5. **Revisa que la URL de la imagen sea correcta**

## ✅ Checklist Final

- [ ] Ejecutaste el script `fix-storage-policies.sql`
- [ ] Verificaste que las 4 políticas existan
- [ ] Confirmaste que el bucket `jerseys` es público
- [ ] Estás logueado como admin
- [ ] Revisaste los logs en la consola del navegador
- [ ] La URL de la imagen tiene el formato correcto
- [ ] El archivo existe en Supabase Storage

## 🎉 Éxito

Si todo está configurado correctamente, deberías ver en la consola:

```
Imagen eliminada exitosamente: [...]
Producto eliminado exitosamente de la base de datos
```

Y la imagen desaparecerá del bucket de Supabase Storage.
