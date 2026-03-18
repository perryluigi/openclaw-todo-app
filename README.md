# OpenClaw Todo App

A modern full-stack TypeScript todo application built with:

- **Backend:** Express + Prisma + SQLite
- **Frontend:** React + Vite + Tailwind
- **Testing:** Vitest + Supertest

---

## Prerequisites

- Node.js 20+ (this project is using Node 22)
- npm

All dependencies are already installed in this environment. If you ever need to reinstall:

```bash
cd /home/ocuser/openclaw-dev/project-workspace
npm install
cd client
npm install
```

---

## Project Structure

```text
project-workspace/
  server/      # Express API (users + todos)
  prisma/      # Prisma schema + migrations + SQLite DB (dev.db)
  client/      # React + Vite frontend
  package.json # Backend + test scripts
```

---

## Running the App

### 1. Start the backend (Express + Prisma)

From the project root:

```bash
cd /home/ocuser/openclaw-dev/project-workspace
npm run dev:server
```

This starts the API server at:

- `http://localhost:3001`

Available todo endpoints:

- `GET    /api/todos`               – list todos, supports `?status=all|pending|completed`
- `POST   /api/todos`               – create a todo
- `GET    /api/todos/:id`           – get a single todo
- `PUT    /api/todos/:id`           – update title/description/completed
- `DELETE /api/todos/:id`           – delete a todo
- `PATCH  /api/todos/:id/toggle`    – toggle completed flag

The DB is SQLite at `prisma/dev.db`, managed via Prisma.

### 2. Start the frontend (React + Vite + Tailwind)

In a separate terminal:

```bash
cd /home/ocuser/openclaw-dev/project-workspace/client
npm run dev
```

This starts the Vite dev server at:

- `http://localhost:5173`

The Vite dev server is configured to proxy API calls:

- Any request to `/api/*` from the frontend goes to `http://localhost:3001`.

So the only requirement is that **both** `npm run dev:server` and `npm run dev` are running.

---

## Running Tests

API tests are written with Vitest + Supertest and live under `server/__tests__/`.

From the project root:

```bash
cd /home/ocuser/openclaw-dev/project-workspace
npm test
```

This runs:

- `server/__tests__/users.api.test.ts`
- `server/__tests__/todos.api.test.ts`

All tests should pass.

---

## Frontend Build

To build the frontend for production:

```bash
cd /home/ocuser/openclaw-dev/project-workspace/client
npm run build
```

Output will be in `client/dist/`.

---

## Useful Commands (root)

From `/home/ocuser/openclaw-dev/project-workspace`:

```bash
# Start backend only
npm run dev:server

# Run tests
npm test
```

From `/home/ocuser/openclaw-dev/project-workspace/client`:

```bash
# Start frontend dev server
npm run dev

# Build frontend
npm run build
```

---

## Git / GitHub

- Branch: `feature/todo-app`
- GitHub repo: https://github.com/perryluigi/openclaw-todo-app

Pushes from this branch are already configured to track `origin/feature/todo-app`.
