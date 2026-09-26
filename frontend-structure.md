# Frontend structure

- `src/pages`: home, login, dashboard and the shared data-module screen.
- `src/components/layout`: application shell and navigation.
- `src/contexts`: authentication state and hook.
- `src/services`: HTTP client and API endpoint definitions.
- `src/lib`: Vite environment configuration.
- `src/assets`: static assets used by the frontend.

Business records are read and written through FastAPI; the frontend does not connect directly to Supabase. Add domain components, hooks, schemas and types when a feature has an implementation that uses them.
