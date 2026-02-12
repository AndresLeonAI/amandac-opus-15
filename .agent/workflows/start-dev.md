---
description: Iniciar servidor de desarrollo
---

# Workflow: Iniciar Servidor de Desarrollo

Este workflow te permite iniciar el servidor de desarrollo de Vite sin tener que hacer `cd` manualmente.

## Pasos

### 1. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

**Directorio de trabajo:** `C:\Users\Andres\Desktop\amandac-opus-15-main (1)\amandac-opus-15-main`

El servidor se iniciará automáticamente en `http://localhost:8080/` y abrirá tu navegador predeterminado.

### 2. Verificar que el servidor está corriendo

Deberías ver en la terminal:

```
VITE v5.4.19  ready in XXXX ms

➜  Local:   http://localhost:8080/
```

### 3. Abrir en el navegador (si no se abrió automáticamente)

Visita manualmente: `http://localhost:8080/`

## Comandos Adicionales

### Construir para producción
```bash
npm run build
```

### Preview de la build de producción
```bash
npm run preview
```

### Actualizar browserslist (si aparece el warning)
```bash
npx update-browserslist-db@latest
```

**Nota:** El comando correcto es `update-browserslist-db`, no `update-browserlist-db` (sin la 's').

## Troubleshooting

### Error: "Missing script: dev"
- **Causa:** Estás en el directorio incorrecto
- **Solución:** Asegúrate de estar en `C:\Users\Andres\Desktop\amandac-opus-15-main (1)\amandac-opus-15-main`

### El servidor no se abre automáticamente
- **Solución:** Abre manualmente `http://localhost:8080/` en tu navegador

### Puerto 8080 ya está en uso
- **Solución:** El servidor ya está corriendo, solo abre `http://localhost:8080/`
- **Alternativa:** Detén el proceso con `Ctrl+C` y vuelve a ejecutar `npm run dev`
