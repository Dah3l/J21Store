# J21 Store - Tienda de Camisetas de Fútbol

Tienda online para venta de camisetas de fútbol con pedido por WhatsApp.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Cloudflare Pages
- **Pagos:** WhatsApp (sin pasarela de pagos)

## Características

- ✅ Catálogo público con grid de productos
- ✅ Filtros por equipo, talla y precio
- ✅ Carrito con localStorage
- ✅ Pedido por WhatsApp con mensaje prellenado
- ✅ Panel admin protegido (Supabase Auth)
- ✅ CRUD de productos con subida de imágenes
- ✅ Responsive mobile-first
- ✅ Diseño oscuro con acentos deportivos

---

## Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto.
2. Anota tu **Project URL** y **anon public key** (en Settings > API).

### 2. Crear tablas en SQL Editor

Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  size TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT DEFAULT '',
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de categorías (opcional)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para productos: lectura pública, escritura solo para admin
CREATE POLICY "Productos visibles públicamente"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Solo admin puede insertar productos"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede actualizar productos"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Solo admin puede eliminar productos"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Políticas para pedidos: solo admin puede ver y gestionar
CREATE POLICY "Solo admin puede ver pedidos"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Cualquiera puede crear pedidos"
  ON orders FOR INSERT
  WITH CHECK (true);
```

### 3. Crear bucket de Storage

1. Ve a **Storage** en el panel de Supabase.
2. Crea un bucket llamado `jerseys` (público).
3. En las políticas del bucket, permite lectura pública y escritura para usuarios autenticados.

### 4. Crear usuario admin

1. Ve a **Authentication** > **Users**.
2. Haz clic en **Add user** > **Create new user**.
3. Ingresa email y contraseña para el admin.

---

## Configuración Local

### 1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd j21-store
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Configurar número de WhatsApp

Edita `src/types/index.ts` y cambia `WHATSAPP_NUMBER` por tu número real (con código de país, sin + ni espacios):

```typescript
export const WHATSAPP_NUMBER = '5491112345678'; // Tu número aquí
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

---

## Deploy en Cloudflare Pages

### Opción A: Conectar repositorio (recomendado)

1. Sube tu código a GitHub/GitLab.
2. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
3. Selecciona tu repositorio.
4. Configura el build:
   - **Framework preset:** `Vite` (o None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Agrega las variables de entorno en Cloudflare:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key de Supabase
6. Haz clic en **Save and Deploy**.

### Opción B: Deploy directo con Wrangler

```bash
npm run build
npx wrangler pages deploy dist --project-name j21-store
```

### Variables de entorno en Cloudflare Pages

Ve a tu proyecto en Cloudflare Pages > **Settings** > **Environment variables** y agrega:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://tu-proyecto.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` (tu anon key) |

---

## Estructura del Proyecto

```
j21-store/
├── public/
│   ├── _headers          # Headers de seguridad para Cloudflare
│   └── _redirects        # Redirects para SPA (single page app)
├── src/
│   ├── components/
│   │   ├── CartDrawer.tsx    # Drawer del carrito
│   │   ├── Header.tsx        # Header/Navbar
│   │   └── ProductCard.tsx   # Tarjeta de producto
│   ├── context/
│   │   └── CartContext.tsx   # Estado global del carrito
│   ├── lib/
│   │   └── supabase.ts      # Cliente de Supabase
│   ├── pages/
│   │   ├── AdminDashboard.tsx # Panel admin (CRUD)
│   │   ├── AdminLogin.tsx     # Login admin
│   │   └── Catalog.tsx        # Catálogo público
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   ├── App.tsx               # Router principal
│   ├── index.css             # Estilos globales
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # Tipos de Vite
├── .env.example              # Plantilla de variables de entorno
├── index.html                # HTML base
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.js
```

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Catálogo público |
| `/admin/login` | Login del panel admin |
| `/admin` | Panel admin (protegido) |

---

## Notas

- Cloudflare Pages maneja automáticamente el fallback a `index.html` para SPAs estáticas, no es necesario un archivo `_redirects`.
- La `anon key` de Supabase es **pública** y segura para usar en el frontend. La seguridad real está en RLS (Row Level Security) y en la `service_role key` (que nunca debe exponerse).
- Para cambiar el número de WhatsApp, edita la constante `WHATSAPP_NUMBER` en `src/types/index.ts`.
