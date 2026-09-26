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

Crea un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
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

## Arquitectura futura

- Frontend: Vercel
- Backend: Render
- Base de datos: Supabase

La app frontend está preparada para conectarse a un backend remoto sin romper el despliegue en Vercel.
