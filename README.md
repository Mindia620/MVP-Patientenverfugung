# Vorsorge Wizard

**Erstellen Sie in 10 Minuten Ihre rechtlich strukturierten Vorsorgedokumente.**

A guided web application for German residents to create advance directive documents:

- **Patientenverfügung** (Living Will)
- **Vorsorgevollmacht** (Power of Attorney)
- **Betreuungsverfügung** (Care Directive)

---

## Features

- ✅ 8-step guided wizard — no registration required
- ✅ German & English UI (i18n)
- ✅ Printable A4 PDFs generated with Playwright
- ✅ Account creation to save and revisit documents
- ✅ Medical term tooltips for accessibility
- ✅ Local draft autosave (localStorage)
- ✅ GDPR-compliant: data export + account deletion
- ✅ Privacy-first: no trackers, httpOnly JWT cookies

---

## Architecture

```
frontend/     React + Vite + TypeScript + Tailwind CSS
backend/      Node.js + Express + TypeScript + Prisma
docker/       Docker Compose for local development
docs/         PRD, UX design, architecture, privacy docs
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit DATABASE_URL, JWT_SECRET
```

### 3. Set up database

```bash
npm run db:setup
```

### 4. Start development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/01-PRD.md](docs/01-PRD.md) | Product Requirements Document |
| [docs/02-UX-DESIGN.md](docs/02-UX-DESIGN.md) | UX Design & Wizard Flow |
| [docs/03-ARCHITECTURE.md](docs/03-ARCHITECTURE.md) | System Architecture |
| [docs/04-DATA-MODEL.md](docs/04-DATA-MODEL.md) | Database Schema & Versioning |
| [docs/05-PRIVACY-ARCHITECTURE.md](docs/05-PRIVACY-ARCHITECTURE.md) | Privacy & GDPR |
| [docs/06-IMPLEMENTATION-PLAN.md](docs/06-IMPLEMENTATION-PLAN.md) | Implementation Roadmap |
| [docs/07-IOS-FUTURE-INTEGRATION.md](docs/07-IOS-FUTURE-INTEGRATION.md) | Future iOS Integration |

---

## Legal Notice

Vorsorge Wizard creates legally structured documents based on user input.
The generated documents do not constitute legal or medical advice.
Users should have their documents reviewed by a lawyer or notary.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, TypeScript, Tailwind CSS 3 |
| Forms | React Hook Form, Zod validation |
| State | Zustand (+ localStorage persistence) |
| i18n | react-i18next (DE + EN) |
| Backend | Node.js 20, Express 4, TypeScript |
| Database | PostgreSQL 15, Prisma 7 ORM |
| Auth | bcrypt + JWT (httpOnly cookies) |
| PDF | Playwright (Headless Chromium) |
| Router | React Router v6 |
