# Vorsorge Wizard

A guided web application for creating advance directive documents in Germany: **Patientenverfügung**, **Vorsorgevollmacht**, and **Betreuungsverfügung**.

## Features

- **Anonymous wizard** — Complete the entire flow without creating an account
- **Guided steps** — Personal info, trusted person, medical preferences, scenarios, values
- **PDF generation** — Download legally structured German documents
- **Account creation** — Required only when saving documents
- **Bilingual** — German and English UI
- **Privacy-first** — Minimal data collection, localStorage draft persistence

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind, React Hook Form, Zod, i18next
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Auth:** JWT in httpOnly cookies, bcrypt
- **PDF:** pdf-lib

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)

### Development

1. **Start PostgreSQL** (if using Docker):
   ```bash
   docker compose up -d postgres
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL and JWT_SECRET
   ```

3. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### Production (Docker)

```bash
docker compose up -d
```

## Project Structure

```
├── docs/                    # Planning documents
│   ├── PRD.md
│   ├── UX-DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── DATA-MODEL.md
│   ├── PRIVACY-ARCHITECTURE.md
│   ├── IMPLEMENTATION-PLAN.md
│   └── IOS-FUTURE-INTEGRATION.md
├── frontend/
├── backend/
│   ├── src/
│   │   ├── content/de/      # Document text modules
│   │   ├── pdf/             # PDF generation
│   │   └── routes/
│   └── prisma/
├── docker/
└── docker-compose.yml
```

## Legal Disclaimer

This tool helps you create advance directive documents. It does not constitute legal advice. For complex situations, consult a lawyer or notary. Documents are designed for use under German law.

## License

Private / Proprietary
