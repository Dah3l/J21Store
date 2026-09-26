# Sistema de Precios con Oferta

## 🎯 Descripción

El sistema ahora permite configurar precios de oferta para los productos. Cuando un producto tiene un precio original y un precio de oferta, se muestra el precio original tachado junto al precio actual (de oferta) en color verde esmeralda.

## 📊 Estructura de Datos

### Base de Datos (Supabase)

Se agregó el campo `original_price` a la tabla `products`:

```sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS original_price INTEGER;
```

- `price`: Precio actual (de oferta si existe)
- `original_price`: Precio original antes de la oferta (opcional)

### TypeScript Interface

```typescript
export interface Product {
  id: string;
  name: string;
  team: string;
  price: number;              // Precio actual (de oferta)
  original_price?: number;    // Precio original (tachado)
  image_url: string;
  created_at: string;
  variants?: ProductVariant[];
  is_preorder?: boolean;
  delivery_days?: number;
}
```

## 🛠️ Panel de Administración

### Formulario de Producto

Al crear o editar un producto, ahora hay dos campos de precio:

1. **Precio (USD)** - Precio actual del producto (obligatorio)
2. **Precio Original (USD)** - Precio antes de la oferta (opcional)

**Ejemplo:**
- Precio: `18` USD
- Precio Original: `20` USD
- Resultado: Se muestra ~~$20~~ **$18 USD**

### Tabla de Productos

En la tabla de listado, si un producto tiene oferta, se muestra:
- Precio original tachado en gris
- Precio actual en verde esmeralda

## 🎨 Visualización en el Catálogo

### Tarjeta de Producto

**Sin oferta:**
```
$20 USD
```

**Con oferta:**
```
~~$20~~ $18 USD
```

El precio original aparece tachado en gris, y el precio actual (de oferta) aparece en verde esmeralda más grande.

### Modal de Selección

En el modal de selección de jugador y talla, también se muestra el precio con oferta:

```
Precio: ~~$20~~ $18 USD
```

## 📱 Mensajes de WhatsApp

Los mensajes de WhatsApp generados automáticamente usan el precio actual (de oferta):

```
• Camiseta Boca Juniors (Local 2024)
  👤 Jugador: Messi
  📏 Talla: M
  📊 Cantidad: 1
  💵 Precio: $18 USD c/u
  💰 Subtotal: $18 USD
```

## 💡 Lógica de Visualización

El sistema verifica si hay oferta usando esta lógica:

```typescript
if (product.original_price && product.original_price > product.price) {
  // Mostrar precio original tachado + precio actual
} else {
  // Mostrar solo precio actual
}
```

**Condiciones para mostrar oferta:**
1. `original_price` debe existir (no ser null/undefined)
2. `original_price` debe ser mayor que `price`

Esto evita mostrar ofertas incorrectas si el precio original es menor o igual al precio actual.

## 🔄 Flujo de Uso

### Para el Administrador:

1. **Crear producto sin oferta:**
   - Precio: `20` USD
   - Precio Original: (dejar vacío)
   - Resultado: Se muestra `$20 USD`

2. **Crear producto con oferta:**
   - Precio: `18` USD
   - Precio Original: `20` USD
   - Resultado: Se muestra ~~$20~~ **$18 USD**

3. **Editar producto para quitar oferta:**
   - Precio: `20` USD
   - Precio Original: (vaciar el campo)
   - Resultado: Se muestra `$20 USD`

4. **Editar producto para cambiar oferta:**
   - Precio: `15` USD
   - Precio Original: `20` USD
   - Resultado: Se muestra ~~$20~~ **$15 USD**

### Para el Cliente:

1. Ve el catálogo con precios de oferta destacados
2. Los precios tachados indican el precio original
3. Los precios en verde indican el precio actual (más bajo)
4. Al hacer clic en "Elegir", ve el precio con oferta en el modal
5. Al agregar al carrito, se usa el precio actual (de oferta)
6. El mensaje de WhatsApp refleja el precio de oferta

## 📋 Migración de Datos

### Script SQL para agregar el campo:

```sql
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
```

**Nota:** Los productos existentes no se ven afectados. `original_price` será `NULL` para todos los productos existentes, lo que significa que no tienen oferta.

## 🎯 Casos de Uso

### 1. Temporada de Ofertas
- Configurar precios originales más altos
- Establecer precios de oferta más bajos
- Los clientes ven el descuento claramente

### 2. Liquidación
- Productos con precio original alto
- Precio de oferta muy bajo para liquidar stock
- Visualización clara del ahorro

### 3. Precios Regulares
- Dejar `original_price` vacío
- Solo se muestra el precio actual
- Sin confusión para el cliente

## ✅ Ventajas

- ✅ **Claridad visual**: Los clientes ven inmediatamente si hay oferta
- ✅ **Flexibilidad**: El admin puede agregar/quitar ofertas fácilmente
- ✅ **Sin cambios drásticos**: Los productos existentes siguen funcionando
- ✅ **Consistente**: El precio de oferta se refleja en todo el sistema (carrito, WhatsApp, etc.)
- ✅ **Profesional**: Diseño limpio con precio tachado y precio actual destacado

## 🔧 Consideraciones Técnicas

1. **Validación**: El sistema verifica que `original_price > price` antes de mostrar la oferta
2. **Opcional**: El campo `original_price` es opcional, no afecta productos sin oferta
3. **Responsive**: El diseño se adapta correctamente en móvil y desktop
4. **Accesible**: Los colores tienen suficiente contraste para ser legibles
5. **Performance**: No hay impacto en el rendimiento, solo verificación condicional

## 📝 Ejemplos Visuales

### Sin Oferta:
```
┌─────────────────────┐
│   [Imagen]          │
├─────────────────────┤
│ BOCA JUNIORS        │
│ Camiseta Local      │
│ $20 USD             │
│                     │
│ [Elegir]            │
└─────────────────────┘
```

### Con Oferta:
```
┌─────────────────────┐
│   [Imagen]          │
├─────────────────────┤
│ BOCA JUNIORS        │
│ Camiseta Local      │
│ ~~$20~~ $18 USD     │
│                     │
│ [Elegir]            │
└─────────────────────┘
```

## 🚀 Implementación Completa

El sistema está completamente implementado en:
- ✅ Base de datos (campo `original_price`)
- ✅ Panel de administración (formulario y tabla)
- ✅ Catálogo público (tarjetas de producto)
- ✅ Modal de selección (precio con oferta)
- ✅ Carrito (usa precio actual)
- ✅ Mensajes de WhatsApp (precio actual)
- ✅ Documentación completa

Todo funciona correctamente y está listo para usar.
