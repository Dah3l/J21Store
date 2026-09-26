# Solución para WhatsApp Business

## 🎯 Los Problemas

### 1. WhatsApp Business vs WhatsApp Normal
Cuando un usuario tiene **WhatsApp Business** instalado y hace clic en un enlace `wa.me` desde el navegador, el sistema a veces abre **WhatsApp normal** en lugar de **WhatsApp Business**.

Esto ocurre porque el enlace `https://wa.me/` usa el esquema `whatsapp://` internamente, y si el usuario tiene ambas apps instaladas, el sistema operativo puede elegir la incorrecta.

### 2. Número de Teléfono Incorrecto
El esquema `whatsapp://send?phone=...` requiere que el número tenga el formato correcto con el símbolo `+` al inicio. Sin el `+`, WhatsApp Business muestra la lista de contactos en lugar de abrir el chat directo con el número configurado.

## ✅ Solución Implementada

### 1. Detección de Dispositivo Móvil

El código ahora detecta si el usuario está en un dispositivo móvil:

```typescript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
```

### 2. Formato Correcto del Número

El número de teléfono ahora se formatea automáticamente para incluir el símbolo `+` al inicio, que es requerido por el esquema nativo de WhatsApp:

```typescript
// Asegurar que el número tenga el formato correcto (con + al inicio)
const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
```

### 3. Esquema Nativo en Móvil

En dispositivos móviles, ahora se usa el esquema nativo `whatsapp://` con el número formateado correctamente, lo que **respeta mejor la app por defecto** configurada por el usuario:

```typescript
if (isMobile) {
  // Usar esquema nativo con número formateado
  const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${message}`;
  window.location.href = whatsappUrl;
  
  // Fallback después de 2.5 segundos
  setTimeout(() => {
    if (!document.hidden) {
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  }, 2500);
}
```

### 3. Fallback Automático

Si el esquema nativo no funciona (por ejemplo, si WhatsApp no está instalado), después de 2 segundos se intenta abrir con `wa.me` como respaldo.

## 📱 Configuración del Usuario (Importante)

### Formato del Número en el Panel de Administración

El número de WhatsApp configurado en el panel de administración debe estar en formato internacional **sin espacios ni caracteres especiales**:

✅ **Correcto:**
- `5351234567` (sin +, el código lo agrega automáticamente)
- `+5351234567` (con +, el código lo respeta)

❌ **Incorrecto:**
- `53 51234567` (con espacios)
- `+53 51234567` (con espacios)
- `(535) 123-4567` (con paréntesis y guiones)

El código ahora formatea automáticamente el número agregando el `+` si no está presente.

### Configurar WhatsApp Business como App por Defecto

Para que **WhatsApp Business** se abra correctamente, el usuario debe configurarlo como **app por defecto** en su dispositivo:

### Android

1. Ve a **Configuración** del teléfono
2. Busca **Aplicaciones** o **Apps**
3. Busca **WhatsApp Business**
4. Toca **Abrir de forma predeterminada** o **Establecer como predeterminada**
5. Activa **Abrir enlaces compatibles**
6. En **Enlaces compatibles**, asegúrate de que `wa.me` y `whatsapp.com` estén marcados

### iOS (iPhone)

En iOS, el sistema generalmente respeta la última app de WhatsApp que se instaló. Si instalaste WhatsApp Business después de WhatsApp normal, debería abrirse Business por defecto.

Si no funciona correctamente:
1. Desinstala WhatsApp normal (si no lo necesitas)
2. O reinstala WhatsApp Business después de WhatsApp normal

### Alternativa: Copiar y Pegar

Si el problema persiste, el usuario puede:
1. Hacer clic en **"Copiar mensaje"** en el formulario
2. Abrir **WhatsApp Business** manualmente
3. Pegar el mensaje en el chat correspondiente

## 🔧 Cómo Funciona Ahora

### Flujo en Móvil:
1. Usuario hace clic en "Enviar por WhatsApp"
2. El sistema detecta que es móvil
3. Formatea el número: `5351234567` → `+5351234567`
4. Intenta abrir con `whatsapp://send?phone=+5351234567&text=...`
5. El sistema operativo abre la app de WhatsApp configurada por defecto
6. Si el usuario configuró WhatsApp Business como predeterminada → ✅ Se abre Business
7. WhatsApp Business abre el chat directo con el número configurado (no muestra lista de contactos)
8. Si algo falla, después de 2.5 segundos intenta con `wa.me`

### Flujo en Desktop:
1. Usuario hace clic en "Enviar por WhatsApp"
2. El sistema detecta que es desktop
3. Abre directamente con `https://wa.me/...`
4. Se abre WhatsApp Web o la app de desktop

## 📊 Comparación de Métodos

| Método | Ventaja | Desventaja |
|--------|---------|------------|
| `https://wa.me/` | Funciona en todos lados | No respeta app por defecto en móvil |
| `whatsapp://send?phone=+...` | Respeta app por defecto, abre chat directo | Solo funciona si WhatsApp está instalado |
| Copiar mensaje | Funciona siempre | Requiere acción manual del usuario |

## 🎯 Recomendación para Usuarios

### Si usas WhatsApp Business:

**Android:**
1. Configuración → Aplicaciones → WhatsApp Business
2. Abrir de forma predeterminada → Activar
3. Enlaces compatibles → Marcar `wa.me` y `whatsapp.com`

**iPhone:**
- Generalmente funciona si WhatsApp Business fue la última app instalada
- Si no, considera desinstalar WhatsApp normal

### Si el problema persiste:
- Usa el botón **"Copiar mensaje"** como alternativa
- Abre WhatsApp Business manualmente y pega el mensaje

## ✅ Resumen

La solución implementada:
- ✅ Detecta automáticamente si es móvil o desktop
- ✅ Formatea el número de teléfono con el símbolo `+` al inicio
- ✅ Usa el esquema nativo `whatsapp://` en móvil (respeta app por defecto)
- ✅ WhatsApp Business abre el chat directo con el número configurado (no muestra lista de contactos)
- ✅ Tiene fallback automático si algo falla
- ✅ Mantiene el botón "Copiar mensaje" como alternativa manual
- ✅ Mensajes con emojis para mayor elegancia

**El usuario solo necesita:**
1. Configurar el número en el panel de administración sin espacios (ej: `5351234567`)
2. Configurar WhatsApp Business como app por defecto en su dispositivo

Con esto, el sistema funciona correctamente en todos los escenarios.
