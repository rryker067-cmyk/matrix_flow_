# Base de datos

El esquema PostgreSQL y sus migraciones están centralizados en `backend/alembic/`. FastAPI se conecta a Supabase mediante `DATABASE_URL`; el frontend no accede directamente a la base de datos.
