# 🚀 Guía Rápida: Deploy Automático en Cloudflare Pages

## Configuración en 5 minutos

### 1. Sube tu código a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/j21-store.git
git push -u origin main
```

### 2. Obtén credenciales de Cloudflare

**API Token:**
1. Ve a https://dash.cloudflare.com/profile/api-tokens
2. Click en **Create Token**
3. Usa la plantilla **Edit Cloudflare Workers**
4. Copia el token generado

**Account ID:**
1. En el dashboard de Cloudflare, mira el panel lateral derecho
2. Copia el **Account ID**

### 3. Configura Secrets en GitHub

Ve a tu repositorio en GitHub:
- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agrega estos 4 secrets:

| Name | Value |
|------|-------|
| `CLOUDFLARE_API_TOKEN` | Tu API Token de Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | Tu Account ID de Cloudflare |
| `VITE_SUPABASE_URL` | https://tu-proyecto.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | Tu anon key de Supabase |

### 4. Crea el proyecto en Cloudflare Pages

1. Ve a https://dash.cloudflare.com/?to=/:account/pages
2. Click en **Create a project**
3. Selecciona **Upload assets** (no conectes Git todavía)
4. Nombre: `j21-store`
5. Click en **Create project**

### 5. ¡Listo!

Cada vez que hagas push a `main` o `master`, GitHub Actions desplegará automáticamente tu sitio.

```bash
git add .
git commit -m "Update products"
git push origin main
```

En 2-3 minutos tu sitio estará actualizado en: `https://j21-store.pages.dev`

## Ver el progreso del deploy

- En GitHub: Pestaña **Actions** de tu repositorio
- En Cloudflare: **Workers & Pages** → Tu proyecto → **Deployments**

## Preview deployments

Cuando crees un Pull Request, se desplegará automáticamente una versión preview:
- URL: `https://[branch-name].j21-store.pages.dev`
- Perfecto para probar cambios antes de mergear a main

## Troubleshooting

**Error: "Project not found"**
- Verifica que el nombre del proyecto en `wrangler-action` coincida con el nombre en Cloudflare Pages

**Error: "Authentication error"**
- Verifica que el API Token tenga permisos de Pages
- Regenera el token si es necesario

**Error: "Build failed"**
- Revisa los logs en la pestaña Actions de GitHub
- Verifica que las variables de entorno estén configuradas correctamente

**El sitio no se actualiza**
- Puede tardar 2-5 minutos en propagarse
- Limpia la caché del navegador (Ctrl+Shift+R)

## Comandos útiles

```bash
# Ver status de deployments
wrangler pages deployment list --project-name j21-store

# Rollback a deployment anterior
wrangler pages deployment rollback --project-name j21-store

# Ver logs de tu proyecto
wrangler pages deployment tail --project-name j21-store
```

## Recursos

- [Documentación de Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [GitHub Actions con Cloudflare](https://github.com/cloudflare/wrangler-action)
- [Documentación de Supabase](https://supabase.com/docs)
