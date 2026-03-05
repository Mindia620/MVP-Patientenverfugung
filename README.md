# Vorsorge Wizard

A guided web application that helps private individuals in Germany create legally structured advance directive documents:

- **Patientenverfügung** — Advance directive for medical treatment
- **Vorsorgevollmacht** — Power of attorney for a trusted person
- **Betreuungsverfügung** — Instructions for court-appointed guardian

## Documentation

- [Product Requirements (PRD)](docs/PRD.md)
- [UX & Wizard Flow](docs/UX-WIZARD-FLOW.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Data Model](docs/DATA-MODEL.md)
- [Privacy Architecture](docs/PRIVACY-ARCHITECTURE.md)
- [Implementation Roadmap](docs/IMPLEMENTATION-ROADMAP.md)
- [Future iOS Integration](docs/ios-integration.md)

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or use Docker)
- npm

### 1. Database

Start PostgreSQL (Docker recommended):

```bash
cd docker
docker-compose up -d
```

Or use an existing PostgreSQL instance. Set `DATABASE_URL` in `backend/.env`.

### 2. Backend

```bash
cd backend
cp .env.example .env   # Or create .env with DATABASE_URL, JWT_SECRET
npm install
npx prisma generate
npx prisma migrate deploy   # Apply migrations (requires running DB)
npx playwright install chromium   # For PDF generation
npm run dev
```

Backend runs at http://localhost:3001

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

### 4. Full Stack

From project root (3 terminals):

```bash
# Terminal 1: Database
docker compose -f docker/docker-compose.yml up -d

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

Then open http://localhost:5173

## Project Structure

```
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express + Prisma + PostgreSQL
├── docker/            # Docker configs
└── docs/              # Planning and architecture docs
```

## License

Proprietary — All rights reserved.
