# MatrixFlow Enterprise

Frontend React + Vite para MatrixFlow Enterprise.

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

## Build de producción

```bash
npm run build
```

## Variables de entorno

Crea `.env` solo si todavía no existe; si ya existe, conserva sus valores y agrega o actualiza únicamente las variables necesarias:

```bash
test -f .env || cp .env.example .env
```

Variables recomendadas:

- `VITE_API_URL`: URL del backend FastAPI desplegado en Render
- `VITE_APP_NAME`: nombre de la aplicación
- `VITE_ENV`: entorno (`development`, `staging`, `production`)

## Despliegue en Vercel

Este proyecto está preparado para desplegarse en Vercel como SPA. Se incluye `vercel.json` para servir rutas del router correctamente.

### Configuración recomendada en Vercel

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL`
  - `VITE_APP_NAME`
  - `VITE_ENV`

## Arquitectura

- Frontend: Vercel
- Backend: Render
- Base de datos: Supabase

El frontend usa `VITE_API_URL` para llamar a FastAPI. Las credenciales de PostgreSQL y JWT solo se configuran en el backend, nunca en Vercel.

Consulta [backend/README.md](backend/README.md) para configurar Supabase, ejecutar migraciones y preparar Render.
