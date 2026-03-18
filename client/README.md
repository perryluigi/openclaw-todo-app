# OpenClaw Todo App – Frontend

React + Vite + Tailwind UI for the todo app.

## Scripts

From this directory (`client/`):

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

Dev server: `http://localhost:5173`

During development, API calls to `/api/*` are proxied to the backend at `http://localhost:3001` (see `vite.config.ts`).

## Tailwind CSS

- Config: `tailwind.config.ts`
- PostCSS: `postcss.config.js`
- Entry CSS: `src/index.css`

The main layout and components live under `src/`:

- `src/App.tsx` – Main app shell
- `src/components/TodoForm.tsx` – New todo form
- `src/components/TodoCard.tsx` – Todo card UI
- `src/components/TodoFilter.tsx` – Filter tabs
- `src/components/TodoTypes.ts` – Shared TypeScript types
