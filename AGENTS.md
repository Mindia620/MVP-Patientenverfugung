# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Vorsorge Wizard is a monorepo with two services:
- **Frontend** (React + Vite + TypeScript + Tailwind CSS) — port 5173
- **Backend** (Express + TypeScript + Prisma) — port 3001

Both use npm as the package manager. See `README.md` for standard dev commands (`npm run dev`, `npm run build`, etc.).

### Services

| Service | Start command | Port |
|---------|--------------|------|
| PostgreSQL | `sudo pg_ctlcluster 16 main start` | 5432 |
| Backend | `npm run dev:backend` | 3001 |
| Frontend | `npm run dev:frontend` | 5173 |
| Both (concurrent) | `npm run dev` | 3001, 5173 |

### Non-obvious caveats

- **Prisma migrations:** The `prisma.config.ts` uses `migrate.url` which is incompatible with `prisma migrate dev` / `prisma db push` in Prisma 7. The initial migration SQL was applied directly via `psql`. If schema changes are needed, apply migration SQL files directly: `PGPASSWORD=vorsorge_dev psql -h localhost -U vorsorge -d vorsorge_wizard -f <migration_file>`.
- **Prisma client generation** works fine: `npm run db:generate --prefix backend`.
- **PostgreSQL credentials** are `vorsorge / vorsorge_dev` with database `vorsorge_wizard` (matches `.env.example`).
- **Playwright Chromium** is required for PDF generation. If missing, run `npx playwright install --with-deps chromium` in the `backend/` directory.
- **Backend .env:** Copied from `backend/.env.example`. The default `JWT_SECRET` is fine for development.
- **Frontend lint** (`npm run lint --prefix frontend`) has 1 pre-existing error (`prefer-const` in `Tooltip.tsx`) and 3 warnings in wizard steps.
- **Vite proxy:** The frontend dev server proxies `/api` requests to `http://localhost:3001` (configured in `frontend/vite.config.ts`), so both servers must run for full functionality.
