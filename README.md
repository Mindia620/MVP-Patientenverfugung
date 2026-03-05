# Vorsorge Wizard

A guided web application for creating legally structured German advance directive documents.

## Documents Generated

| Document | German Name | Legal Basis |
|---|---|---|
| Living Will | Patientenverfügung | § 1827 BGB |
| Health Care Power of Attorney | Vorsorgevollmacht | § 1820 BGB |
| Guardianship Directive | Betreuungsverfügung | §§ 1814–1822 BGB |

## Repository Structure

```
vorsorge-wizard/
├── frontend/          React + Vite + TypeScript + Tailwind
├── backend/           Express + Prisma + PostgreSQL
├── docker/            Docker / docker-compose configuration
└── docs/              Architecture, PRD, UX Flow, Privacy, iOS docs
```

## Quick Start (Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+

### 1. Set up the database

```bash
createuser -P vorsorge          # password: changeme
createdb -O vorsorge vorsorge_wizard
```

### 2. Start the backend

```bash
cd backend
cp .env.example .env            # edit DATABASE_URL and JWT_SECRET
npm install
npx prisma db push --schema=src/prisma/schema.prisma
npm run dev
```

Backend runs on http://localhost:4000

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Production (Docker)

```bash
cd docker
cp .env.example .env            # set secrets
docker compose up -d
```

Application runs on http://localhost:80

## Documentation

| Document | Description |
|---|---|
| [PRD](docs/PRD.md) | Product Requirements Document |
| [UX Flow](docs/UX_FLOW.md) | Wizard UX design |
| [Architecture](docs/ARCHITECTURE.md) | System architecture |
| [Privacy](docs/PRIVACY.md) | Privacy & GDPR architecture |
| [iOS Integration](docs/IOS_INTEGRATION.md) | Future iOS native integration |

## Legal Notice

This application does not constitute legal advice. Generated documents are intended as guidance only and do not replace individual legal consultation. Users must sign and date documents by hand for legal validity.

## Tech Stack

**Frontend:** React 18 · Vite 5 · TypeScript · Tailwind CSS · React Hook Form · Zod · Zustand · react-i18next

**Backend:** Node.js 20 · Express 4 · Prisma ORM · PostgreSQL 15 · bcrypt · JWT · Playwright (PDF)

**Infrastructure:** Docker · nginx · PostgreSQL
