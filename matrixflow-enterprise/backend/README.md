# Backend - Fase 2

API FastAPI funcional para MatrixFlow Enterprise. Esta fase implementa routers, esquemas Pydantic, servicios de negocio, algoritmos NumPy y un repositorio en memoria. La persistencia PostgreSQL y SQLAlchemy corresponden a la Fase 3.

## Ejecutar

```bash
python -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/uvicorn app.main:app --reload
```

Documentación interactiva: `http://localhost:8000/docs`

## Endpoints iniciales

- `POST /api/v1/auth/login`
- `GET|POST /api/v1/companies`
- `GET|POST /api/v1/vectors`
- `GET|POST /api/v1/matrices`
- `GET|POST /api/v1/operations`
- `GET /api/v1/reports`
- `GET /health`
