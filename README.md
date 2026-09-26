# J21 Store - Manual Completo de Usuario

## 📖 Índice
1. [Introducción](#introducción)
2. [Navegación del Sitio](#navegación-del-sitio)
3. [Cómo Hacer un Pedido](#cómo-hacer-un-pedido)
4. [Sistema de Carrito](#sistema-de-carrito)
5. [WhatsApp y Pagos](#whatsapp-y-pagos)
6. [Panel de Administración](#panel-de-administración)
7. [Gestión de Productos](#gestión-de-productos)
8. [Gestión de Zonas de Entrega](#gestión-de-zonas-de-entrega)
9. [Configuración del Negocio](#configuración-del-negocio)
10. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Introducción

**J21 Store** es una tienda online especializada en camisetas de fútbol que te permite:
- Explorar un catálogo de camisetas de diferentes equipos y jugadores
- Seleccionar jugadores específicos y tallas disponibles
- Agregar productos al carrito de compras
- Realizar pedidos directamente por WhatsApp
- Recibir entregas en diferentes zonas con costos específicos

### Tipos de Productos

#### 📦 Productos en Stock
- Disponibles para entrega inmediata
- Tienen jugadores y tallas específicas
- Stock limitado por jugador/talla
- Se muestran primero en el catálogo

#### 🕐 Productos por Encargo
- No están en stock, se fabrican bajo pedido
- Tiempo de entrega estimado (ej: 7 días)
- Stock ilimitado
- Se muestran después de los productos en stock

### Sistema de Precios

#### 💵 Precios en USD
- Todos los productos se venden en dólares estadounidenses (USD)
- Algunos productos pueden tener **precio de oferta**
- Si hay oferta, verás el precio original tachado y el precio actual en verde

#### 🚚 Costos de Envío en CUP
- Los costos de envío se calculan por zona de entrega
- Se pagan en pesos cubanos (CUP)
- Se muestran claramente antes de confirmar el pedido

---

## 🧭 Navegación del Sitio

### Página Principal

La página principal muestra:

1. **Header (Arriba)**
   - Logo de J21 Store
   - Nombre del negocio
   - Icono del carrito con contador de productos

2. **Hero Section**
   - Logo grande
   - Nombre del negocio
   - Descripción

3. **Barra de Búsqueda**
   - Busca por nombre de producto, equipo o jugador
   - Botón para limpiar búsqueda

4. **Filtros**
   - **Equipo**: Filtra por equipo específico
   - **Talla**: Filtra por talla disponible
   - **Disponibilidad**: Todos / En stock / Por encargo
   - **Ofertas**: Todos / Solo ofertas 🔥
   - Botón "Limpiar filtros"

5. **Catálogo de Productos**
   - Grid de tarjetas de productos
   - 12 productos por página (3 filas × 4 columnas)
   - Paginación al final

6. **Sección de Información**
   - Menú desplegable con:
     - Información sobre el negocio
     - Preguntas frecuentes (FAQ)

7. **Footer (Abajo)**
   - Sección de contacto con enlaces a:
     - WhatsApp
     - Email
     - Instagram
     - Facebook
     - Dirección física
   - Copyright

### Tarjetas de Producto

Cada tarjeta muestra:

```
┌─────────────────────────┐
│      [Imagen]           │ ← Clic para ver en grande
│        🔍               │
├─────────────────────────┤
│ EQUIPO                  │
│ Nombre Producto         │
│                         │
│ $20 USD                 │ ← Precio (o ~~$25~~ $20 si hay oferta)
│ 3 jugadores             │ ← O "🚚 7 días" si es por encargo
│                         │
│ [Elegir]                │ ← O "🕐 Encargo" si es por encargo
└─────────────────────────┘
```

**Características:**
- **Imagen clickeable**: Haz clic para ver la imagen en pantalla completa
- **Badge "🕐 Por encargo"**: Aparece en la esquina superior derecha si es por encargo
- **Badge "¡Últimas X!"**: Aparece si quedan 3 o menos unidades
- **Badge "✓ X en carrito"**: Aparece si ya tienes ese producto en el carrito
- **Precio con oferta**: Si hay oferta, verás ~~$25~~ **$20 USD**

---

## 🛒 Cómo Hacer un Pedido

### Paso 1: Explorar el Catálogo

1. Navega por las tarjetas de productos
2. Usa la **barra de búsqueda** para encontrar productos específicos
3. Usa los **filtros** para refinar tu búsqueda:
   - Filtra por equipo (ej: "Real Madrid")
   - Filtra por talla (ej: "M")
   - Filtra por disponibilidad (en stock o por encargo)
   - Filtra solo ofertas 🔥

### Paso 2: Seleccionar Producto

#### Para Productos en Stock:

1. Haz clic en **"Elegir"** en la tarjeta del producto
2. Se abre un modal con:
   - Imagen del producto
   - Nombre y equipo
   - Lista de jugadores disponibles
   - Cada jugador muestra sus tallas disponibles

3. **Selecciona un jugador**:
   - Haz clic en el nombre del jugador
   - Se resaltará en verde
   - Aparecerán las tallas disponibles abajo

4. **Selecciona una talla**:
   - Haz clic en la talla que quieres
   - Se resaltará en verde

5. **Verifica el resumen**:
   - Precio del producto
   - Jugador seleccionado
   - Talla seleccionada

6. Haz clic en **"Agregar al carrito"**
   - El botón cambiará a "✓ Agregado al carrito"
   - El modal se cerrará automáticamente
   - El contador del carrito aumentará

#### Para Productos por Encargo:

1. Haz clic en **"🕐 Encargo"** en la tarjeta del producto
2. El producto se agrega directamente al carrito
   - No necesitas seleccionar jugador ni talla
   - El botón cambiará a "✓ Agregado"
   - El contador del carrito aumentará

### Paso 3: Revisar el Carrito

1. Haz clic en el **icono del carrito** en el header
2. Se abre un drawer (panel lateral) desde la derecha
3. Revisa los productos:
   - Nombre del producto
   - Equipo
   - Jugador (si aplica)
   - Talla (si aplica)
   - Cantidad
   - Precio subtotal

4. **Ajustar cantidades**:
   - Usa los botones **−** y **+** para cambiar la cantidad
   - El botón **+** se deshabilita si alcanzas el stock máximo
   - El precio subtotal se actualiza automáticamente

5. **Eliminar productos**:
   - Haz clic en el icono de basura 🗑️
   - El producto se elimina del carrito

6. **Ver el total**:
   - Total de productos en USD
   - Nota: "* Envío se calcula al finalizar el pedido"

### Paso 4: Finalizar Pedido

1. Haz clic en **"Pedir por WhatsApp"**
2. Se abre el **formulario de pedido**

3. **Completa tus datos**:
   - **Nombre completo** (obligatorio)
   - **Zona de entrega** (obligatorio)
     - Selecciona tu zona de la lista
     - Cada zona muestra su costo de envío
     - Si tu zona no está, selecciona "Otra dirección"
   - **Dirección** (solo si seleccionaste "Otra dirección")
   - **Hora para retirar el pedido** (obligatorio)
     - Ejemplo: "Mañana a las 3pm"
   - **Notas adicionales** (opcional)
     - Ejemplo: "Llamar antes de entregar"

4. **Revisa el resumen**:
   - Total de productos en USD
   - Costo de envío en CUP
   - Total de productos
   - Total de envío

5. Haz clic en **"Enviar por WhatsApp"**
   - Se abre WhatsApp con el mensaje prellenado
   - El mensaje incluye todos los detalles de tu pedido

6. **Alternativa: Copiar mensaje**
   - Si WhatsApp no se abre automáticamente
   - Haz clic en **"Copiar mensaje (fallback)"**
   - Abre WhatsApp manualmente
   - Pega el mensaje en el chat

7. **Envía el mensaje**
   - Revisa el mensaje en WhatsApp
   - Haz clic en "Enviar"
   - El negocio recibirá tu pedido completo

### Paso 5: Confirmación

- El negocio te responderá por WhatsApp
- Coordinarás los detalles de entrega y pago
- El carrito se vacía automáticamente después de enviar el pedido

---

## 🛍️ Sistema de Carrito

### Características

- **Persistencia**: El carrito se guarda en tu navegador (localStorage)
  - Si cierras el navegador, el carrito se mantiene
  - Si limpias los datos del navegador, el carrito se vacía

- **Control de Stock**: 
  - Para productos en stock, no puedes agregar más unidades de las disponibles
  - El botón **+** se deshabilita cuando alcanzas el stock máximo
  - Mensaje "⚠ Stock máximo" aparece cuando corresponde

- **Productos por Encargo**:
  - Stock ilimitado
  - Puedes agregar la cantidad que quieras

- **Sincronización**:
  - Si agregas un producto desde la tarjeta, el carrito se actualiza
  - Si eliminas un producto del carrito, el badge de la tarjeta se actualiza

### Visualización del Carrito

```
┌─────────────────────────────────┐
│ 🛒 Mi Carrito              [×] │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [Img] Camiseta Boca         │ │
│ │       Boca Juniors          │ │
│ │       👤 Messi              │ │
│ │       📏 Talla: M           │ │
│ │       [−] 2 [+]    $40 USD  │ │
│ │                        [🗑️] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Img] Camiseta Real         │ │
│ │       Real Madrid           │ │
│ │       👤 Mbappé             │ │
│ │       📏 Talla: L           │ │
│ │       [−] 1 [+]    $25 USD  │ │
│ │                        [🗑️] │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ Total Productos      $65 USD   │
│ * Envío se calcula al          │
│   finalizar el pedido          │
│                                 │
│ [📱 Pedir por WhatsApp]        │
│ [Vaciar carrito]               │
└─────────────────────────────────┘
```

---

## 📱 WhatsApp y Pagos

### Compatibilidad con WhatsApp

El sistema es compatible con:
- ✅ WhatsApp normal
- ✅ WhatsApp Business App
- ✅ WhatsApp Business API
- ✅ WhatsApp Web (desktop)

### Cómo Funciona

1. **En Móvil**:
   - Se usa el esquema nativo `whatsapp://send?phone=...`
   - Abre la app de WhatsApp configurada por defecto
   - Si tienes WhatsApp Business, se abre WhatsApp Business
   - El mensaje se prellena automáticamente

2. **En Desktop**:
   - Se usa `https://wa.me/...`
   - Abre WhatsApp Web o la app de desktop
   - El mensaje se prellena automáticamente

### Formato del Número

El número de WhatsApp del negocio debe estar configurado en el panel admin:
- Formato correcto: `5351234567` (sin espacios, sin +)
- El sistema agrega automáticamente el `+` al enviar

### Mensaje de WhatsApp

El mensaje incluye:

```
🛒 *Nuevo Pedido - J21 Store*

👤 *Cliente:* Juan Pérez
📍 *Dirección:* Vedado
🕐 *Hora de retiro:* Mañana a las 3pm

━━━━━━━━━━━━━━━━━━━━
📦 *PRODUCTOS:*

• Camiseta Boca Juniors (Local 2024)
  👤 Jugador: Messi
  📏 Talla: M
  📊 Cantidad: 2
  💵 Precio: $20 USD c/u
  💰 Subtotal: $40 USD

• Camiseta Real Madrid (Local 2024) 🕐 *POR ENCARGO*
  📊 Cantidad: 1
  💵 Precio: $25 USD c/u
  💰 Subtotal: $25 USD
  🚚 Entrega: 7 días

━━━━━━━━━━━━━━━━━━━━
💵 *Total Productos: $65 USD*

🚚 *Envío (Vedado): $2500 CUP*

━━━━━━━━━━━━━━━━━━━━
💰 *RESUMEN:*
• Productos: $65 USD
• Envío: $2500 CUP

¡Hola! Me gustaría hacer este pedido.
```

### Métodos de Pago

- Los pagos se coordinan directamente con el negocio por WhatsApp
- Métodos comunes:
  - Transferencia bancaria
  - Efectivo contra entrega
  - Otros métodos acordados con el negocio

---

## 🔐 Panel de Administración

### Acceso

1. Ve a `https://tu-dominio.com/admin/login`
2. Ingresa tus credenciales:
   - Email
   - Contraseña
3. Haz clic en **"Ingresar"**
4. Serás redirigido al panel de administración

### Estructura del Panel

El panel tiene 3 pestañas principales:

1. **📦 Productos**: Gestión de camisetas
2. **🚚 Envíos**: Gestión de zonas de entrega
3. **⚙️ Config**: Configuración del negocio

---

## 📦 Gestión de Productos

### Ver Productos

La pestaña **Productos** muestra:

1. **Barra de búsqueda**
   - Busca por nombre, equipo o talla
   - Filtra la tabla en tiempo real

2. **Contador de productos**
   - Muestra cuántos productos hay
   - Si hay búsqueda activa, muestra "X productos (de Y total)"

3. **Botón "+ Nuevo Producto"**
   - Abre el formulario para crear un producto

4. **Tabla de productos**
   - Imagen miniatura
   - Nombre y equipo
   - Badge "🕐 ENCARGO" si es por encargo
   - Variantes (jugadores) o días de entrega
   - Precio (con oferta si aplica)
   - Stock total
   - Acciones: Editar / Eliminar

### Crear Producto

1. Haz clic en **"+ Nuevo Producto"**
2. Completa el formulario:

#### Información Básica

- **Nombre**: Nombre del producto
  - Ejemplo: "Camiseta Local 2024"
  
- **Equipo**: Nombre del equipo
  - Ejemplo: "Boca Juniors"
  
- **Precio (USD)**: Precio actual del producto
  - Valor por defecto: 20 USD
  - Ejemplo: 25

- **Precio Original (USD)**: Precio antes de oferta (opcional)
  - Si llenas este campo, se mostrará tachado junto al precio actual
  - Ejemplo: 30 (se mostrará ~~$30~~ **$25 USD**)

#### Imagen

- **URL de imagen**: Pega la URL de la imagen
- **Subir**: Haz clic para subir una imagen desde tu dispositivo
  - La imagen se sube a Supabase Storage
  - Se genera automáticamente la URL pública

#### Tipo de Producto

- **📦 En stock**: Producto disponible para entrega inmediata
  - Debes agregar jugadores y tallas
  
- **🕐 Por encargo**: Producto que se fabrica bajo pedido
  - Configura el tiempo de entrega en días
  - No necesitas agregar jugadores ni tallas

#### Jugadores y Tallas (solo para productos en stock)

1. Haz clic en **"+ Agregar jugador"**
2. Completa:
   - **Nombre del jugador**: Ejemplo: "Messi"
   - **Tallas disponibles**: Haz clic en las tallas que quieres agregar
     - S, M, L, XL, XXL
     - Puedes seleccionar múltiples tallas
   - **Stock**: Cantidad disponible para este jugador
     - Ejemplo: 10
3. Repite para agregar más jugadores
4. Los jugadores se muestran en orden de agregación
5. Puedes eliminar jugadores con el botón "Eliminar"

3. Haz clic en **"Crear Producto"**
4. El producto se guarda y aparece en la tabla

### Editar Producto

1. En la tabla, haz clic en **"Editar"** en el producto que quieres modificar
2. Se abre el formulario con los datos actuales
3. Modifica lo que necesites:
   - Cambiar nombre, equipo, precio
   - Cambiar imagen (la imagen anterior se elimina automáticamente del storage)
   - Cambiar tipo de producto (stock ↔ encargo)
   - Agregar/eliminar jugadores
   - Cambiar tallas y stock de cada jugador
4. Haz clic en **"Guardar Cambios"**
5. Los cambios se aplican inmediatamente

### Eliminar Producto

1. En la tabla, haz clic en **"Eliminar"** en el producto que quieres eliminar
2. Aparece una confirmación: "¿Eliminar este producto?"
3. Haz clic en "Aceptar"
4. El producto se elimina:
   - Se elimina de la base de datos
   - Se elimina la imagen del storage (si tiene)
   - Se actualiza la tabla

---

## 🚚 Gestión de Zonas de Entrega

### Ver Zonas

La pestaña **Envíos** muestra:

1. **Lista de zonas**
   - Nombre de la zona
   - Precio de envío en CUP
   - Acciones: Editar / Eliminar

2. **Zonas predefinidas**
   - La Habana Vieja: $1200 CUP
   - Centro Habana: $1500 CUP
   - Vedado: $2500 CUP
   - Cerro: $2500 CUP
   - Marianao: $3000 CUP
   - Y muchas más...

### Agregar Zona

1. Haz clic en **"+ Nueva Zona"**
2. Se abre el formulario
3. Completa:
   - **Nombre de la zona**: Ejemplo: "Playa"
   - **Precio de envío**: Ejemplo: 2000
4. Haz clic en **"Agregar Zona"**
5. La zona aparece inmediatamente en la lista y en el selector del cliente

### Editar Precio

1. En la lista, haz clic en **"Editar"** en la zona que quieres modificar
2. El campo de precio se convierte en editable
3. Cambia el precio
4. Haz clic en **"Guardar"** o presiona Enter
5. El cambio se aplica inmediatamente

### Eliminar Zona

1. En la lista, haz clic en **"Eliminar"** en la zona que quieres eliminar
2. Aparece una confirmación: "¿Eliminar la zona 'X'?"
3. Haz clic en "Aceptar"
4. La zona se elimina de la lista y del selector del cliente

---

## ⚙️ Configuración del Negocio

### Acceso

1. Ve a la pestaña **⚙️ Config**
2. Se abre el formulario de configuración

### Campos de Configuración

#### Información General

- **Nombre del negocio**: Nombre que aparece en el header y footer
  - Ejemplo: "J21 Store"
  
- **Descripción**: Texto descriptivo que aparece en el hero
  - Ejemplo: "Tu tienda de camisetas de fútbol"

#### Contacto

- **WhatsApp**: Número de WhatsApp para recibir pedidos
  - Formato: Código de país + número (sin +, sin espacios)
  - Ejemplo: `5351234567`
  
- **Email**: Correo electrónico de contacto
  - Ejemplo: `contacto@j21store.com`
  
- **Dirección**: Dirección física del negocio
  - Ejemplo: "Av. Siempre Viva 1234, Buenos Aires"

#### Redes Sociales

- **Instagram**: Usuario de Instagram (sin @)
  - Ejemplo: `j21store`
  
- **Facebook**: URL completa o nombre de página
  - Ejemplo: `https://facebook.com/j21store` o `j21store`

### Guardar Cambios

1. Completa o modifica los campos
2. Haz clic en **"Guardar Configuración"**
3. Aparece un mensaje: "✓ Configuración guardada correctamente"
4. Los cambios se reflejan inmediatamente en:
   - Header (nombre del negocio)
   - Hero (nombre y descripción)
   - Footer (sección de contacto)
   - Mensajes de WhatsApp (nombre del negocio)

---

## 🔧 Solución de Problemas

### El carrito no se actualiza

**Problema**: Agregas productos pero el carrito no muestra el contador.

**Solución**:
1. Recarga la página (F5 o Ctrl+R)
2. Si el problema persiste, limpia la caché del navegador
3. Verifica que JavaScript esté habilitado

### WhatsApp no se abre

**Problema**: Haces clic en "Pedir por WhatsApp" pero no se abre WhatsApp.

**Solución**:
1. **En móvil**:
   - Verifica que tengas WhatsApp instalado
   - Si tienes WhatsApp Business, configúralo como app por defecto:
     - Android: Configuración → Aplicaciones → WhatsApp Business → Abrir de forma predeterminada
     - iOS: Generalmente funciona si WhatsApp Business fue la última app instalada
   
2. **En desktop**:
   - Verifica que tengas WhatsApp Web o la app de desktop
   - Intenta con otro navegador

3. **Alternativa**:
   - Haz clic en **"Copiar mensaje (fallback)"**
   - Abre WhatsApp manualmente
   - Pega el mensaje en el chat

### Las imágenes no se muestran

**Problema**: Las tarjetas de productos no muestran imágenes.

**Solución**:
1. Verifica que el bucket `jerseys` en Supabase sea público
2. Ejecuta este SQL en Supabase:
   ```sql
   UPDATE storage.buckets SET public = true WHERE name = 'jerseys';
   ```
3. Recarga la página

### No puedo eliminar imágenes del storage

**Problema**: Al eliminar un producto, la imagen no se borra del storage.

**Solución**:
1. Verifica las políticas de storage en Supabase
2. Ejecuta este SQL:
   ```sql
   CREATE POLICY "Admin puede eliminar imágenes"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (bucket_id = 'jerseys');
   ```

### Los precios no se muestran correctamente

**Problema**: El precio con oferta no se ve tachado.

**Solución**:
1. Verifica que el campo `original_price` exista en la tabla `products`
2. Ejecuta este SQL:
   ```sql
   ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price INTEGER;
   ```
3. Edita el producto y llena el campo "Precio Original"

### El filtro de ofertas no funciona

**Problema**: Seleccionas "🔥 Solo ofertas" pero no filtra correctamente.

**Solución**:
1. Verifica que los productos tengan `original_price` mayor que `price`
2. Edita los productos y configura los precios correctamente

### La paginación no hace scroll al inicio

**Problema**: Al cambiar de página, la vista no sube al inicio del catálogo.

**Solución**:
1. Recarga la página
2. Si el problema persiste, verifica que el navegador soporte `scrollTo` con `behavior: 'smooth'`

### No puedo agregar más productos al carrito

**Problema**: El botón **+** está deshabilitado.

**Solución**:
1. Has alcanzado el stock máximo disponible
2. Reduce la cantidad o elimina el producto del carrito
3. Para productos por encargo, el stock es ilimitado

### El tutorial no aparece

**Problema**: El tutorial del inicio no aparece para nuevos usuarios.

**Solución**:
1. El tutorial solo aparece la primera vez que visitas el sitio
2. Si ya lo viste, no aparecerá de nuevo
3. Para verlo de nuevo, limpia los datos del navegador:
   - Abre DevTools (F12)
   - Ve a Application → Local Storage
   - Elimina la clave `j21-onboarding-seen`
   - Recarga la página

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de **Preguntas Frecuentes** en el sitio
2. Contacta al administrador del sitio
3. Revisa la documentación técnica en el repositorio

---

## 🎓 Tutorial Interactivo

La primera vez que visites el sitio, aparecerá un tutorial interactivo con 6 pasos:

1. **⚽ Bienvenida**: Introducción a J21 Store
2. **🔍 Busca y filtra**: Cómo usar la búsqueda y los filtros
3. **📋 Dos tipos de productos**: Diferencia entre stock y encargo
4. **🖼️ Ve las fotos en grande**: Cómo usar el lightbox
5. **👕 Elige tu camiseta**: Cómo seleccionar jugador y talla
6. **📱 Haz tu pedido**: Cómo finalizar la compra por WhatsApp

Puedes navegar con "Siguiente" o saltar el tutorial con "Saltar".

---

## 🌟 Características Destacadas

- ✅ **Catálogo dinámico** con productos en stock y por encargo
- ✅ **Sistema de precios** con ofertas y descuentos
- ✅ **Múltiples jugadores y tallas** por producto
- ✅ **Control de stock** por jugador/talla
- ✅ **Zonas de entrega** con precios específicos
- ✅ **Carrito persistente** con localStorage
- ✅ **Pedidos por WhatsApp** con mensaje prellenado
- ✅ **Compatible con WhatsApp Business**
- ✅ **Lightbox de imágenes** para ver detalles
- ✅ **Búsqueda y filtros** avanzados
- ✅ **Paginación** con scroll automático
- ✅ **Responsive** mobile-first
- ✅ **Diseño moderno** oscuro con acentos deportivos
- ✅ **Panel de administración** completo
- ✅ **Gestión de imágenes** con Supabase Storage
- ✅ **Eliminación automática** de imágenes del storage
- ✅ **Tutorial interactivo** para nuevos usuarios
- ✅ **Sección de contacto** con redes sociales
- ✅ **FAQ** con preguntas frecuentes

---

**¡Disfruta tu experiencia en J21 Store!** ⚽🏆
