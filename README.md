# Vorsorge Wizard

A guided web application that helps private individuals in Germany create legally structured advance directive documents — simple, secure, and privacy-first.

## Documents Generated

- **Patientenverfügung** (Advance Healthcare Directive / Living Will)
- **Vorsorgevollmacht** (Lasting Power of Attorney)
- **Betreuungsverfügung** (Custodianship Directive)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Forms | React Hook Form + Zod validation |
| State | Zustand (wizard), localStorage (draft persistence) |
| i18n | react-i18next (German + English) |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | bcrypt + JWT (httpOnly cookies) |
| PDF | pdf-lib (A4 document generation) |
| Infrastructure | Docker Compose |

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16
- npm

### 1. Database Setup

```bash
# Using Docker (recommended)
cd docker && docker compose up -d

# Or use an existing PostgreSQL instance
createdb vorsorge
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # or edit .env with your DATABASE_URL
npm install
npx prisma db push
npx prisma generate
npm run dev
```

Backend runs on `http://localhost:3001`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` with API proxy to backend.

## Project Structure

```
vorsorge-wizard/
├── frontend/            # React + Vite frontend
│   └── src/
│       ├── components/  # UI and wizard components
│       ├── i18n/        # DE + EN translations
│       ├── schemas/     # Zod validation schemas
│       ├── store/       # Zustand state stores
│       └── types/       # TypeScript types
├── backend/             # Express + Prisma backend
│   └── src/
│       ├── content/de/  # German document text modules
│       ├── middleware/   # Auth middleware
│       ├── routes/      # API routes
│       ├── services/    # PDF generation
│       └── lib/         # Prisma client, JWT utils
├── docker/              # Docker Compose + Dockerfiles
└── docs/                # Architecture & design documents
    ├── 01-PRD.md
    ├── 02-UX-WIZARD-FLOW.md
    ├── 03-SYSTEM-ARCHITECTURE.md
    ├── 04-DATA-MODEL.md
    ├── 05-PRIVACY-ARCHITECTURE.md
    ├── 06-IMPLEMENTATION-PLAN.md
    └── 07-IOS-INTEGRATION.md
```

## Wizard Flow

1. **Intro** — Value proposition and legal disclaimer
2. **Personal Info** — User's identity and address
3. **Trusted Person** — Power of attorney recipient + optional alternate
4. **Medical Preferences** — CPR, ventilation, nutrition, dialysis, antibiotics, pain management
5. **Situational Scenarios** — Terminal illness, unconsciousness, severe dementia
6. **Values & Wishes** — Optional personal values, organ donation, burial wishes
7. **Summary & Review** — Confirm all information
8. **Account** — Register/login to save documents
9. **Generate** — PDF generation and download

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in |
| POST | /api/auth/logout | Sign out |
| GET | /api/auth/me | Current user |
| POST | /api/documents | Save wizard answers |
| GET | /api/documents | List document packages |
| GET | /api/documents/:id | Get package details |
| DELETE | /api/documents/:id | Delete package |
| POST | /api/documents/:id/generate | Generate PDFs |
| GET | /api/documents/:id/pdf/:type | Download PDF |

## Legal Disclaimer

Vorsorge Wizard does not provide legal advice. The generated documents are based on commonly accepted formulations and do not replace individual legal counsel.

## License

ISC
