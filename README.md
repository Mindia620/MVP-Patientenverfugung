# Vorsorge Wizard (MVP)

Privacy-first web application for creating legally structured German advance directive drafts:

1. Patientenverfügung
2. Vorsorgevollmacht
3. Betreuungsverfügung

## Repository structure

- `docs/` — PRD, architecture, roadmap, iOS future documentation
- `frontend/` — React + Vite + TypeScript + Tailwind + RHF + Zod + i18n
- `backend/` — Node.js + Express + Prisma + PostgreSQL + JWT cookie auth + PDF generation
- `docker/` — Dockerfiles and compose stack

## Key MVP behavior

- Anonymous wizard completion with local draft persistence.
- Account required before cloud save and PDF generation.
- DE + EN UI support.
- Structured legal document text module assembly in German.
- Printable A4 PDF generation.
- Disclaimers included in UI and generated document text.

## Local development

### Prerequisites
- Node.js 22+
- PostgreSQL 16+ (or Docker)

### 1) Backend

```bash
cd backend
cp .env.example .env
npx prisma generate
# create DB tables
npx prisma db push
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.
Backend runs at `http://localhost:4000`.

## Docker

```bash
cd docker
docker compose up --build
```

## Important legal disclaimer

This project provides structured drafting support and does **not** constitute legal or medical advice. Users must review, date, sign, and distribute documents appropriately, and seek professional advice where needed.
