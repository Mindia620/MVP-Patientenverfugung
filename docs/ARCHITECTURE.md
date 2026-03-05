# Vorsorge Wizard — System Architecture

**Version:** 1.0  
**Date:** March 2025

---

## 1. Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                                │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  React + Vite + TypeScript + Tailwind + React Hook Form + Zod    │    │
│  │  i18n (DE/EN)                                                    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS / REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVER                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Node.js + Express                                               │    │
│  │  • Auth (JWT, httpOnly cookies)                                   │    │
│  │  • REST endpoints                                                 │    │
│  │  • PDF generation (Playwright or pdf-lib)                         │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Prisma ORM
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           PostgreSQL                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool, fast HMR |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **react-i18next** | Internationalization (DE/EN) |
| **React Router** | Client-side routing |

### Frontend Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level pages
│   ├── wizard/           # Wizard steps and logic
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities, API client
│   ├── i18n/             # Translation files
│   ├── types/            # TypeScript types
│   └── App.tsx
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 3. Backend Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | HTTP server |
| **Prisma** | ORM, migrations |
| **PostgreSQL** | Database |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT creation/verification |
| **Playwright** or **pdf-lib** | PDF generation |

### Backend Structure

```
backend/
├── src/
│   ├── routes/           # Express route handlers
│   ├── middleware/       # Auth, error handling
│   ├── services/         # Business logic
│   ├── pdf/              # PDF generation logic
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── content/              # Document text modules
│   ├── de/
│   │   ├── patientenverfuegung.ts
│   │   ├── vorsorgevollmacht.ts
│   │   └── betreuungsverfuegung.ts
│   └── en/               # If needed for document variants
├── package.json
└── tsconfig.json
```

---

## 4. API Design

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account (email, password) |
| POST | `/api/auth/login` | Login, returns JWT in httpOnly cookie |
| POST | `/api/auth/logout` | Clear cookie |
| GET | `/api/auth/me` | Current user (if authenticated) |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents` | Save document package (answers) |
| GET | `/api/documents` | List user's document packages |
| GET | `/api/documents/:id` | Get single package |
| POST | `/api/documents/:id/generate-pdf` | Generate PDF(s) for package |
| DELETE | `/api/documents/:id` | Delete package (GDPR) |

### PDF Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pdf/generate` | Generate PDF from answers (anonymous or authenticated) |

---

## 5. Authentication Flow

```
1. User completes wizard (anonymous)
2. User clicks "Save documents"
3. Frontend shows registration form
4. POST /api/auth/register → create User
5. Server sets httpOnly cookie with JWT
6. POST /api/documents with answers → create DocumentPackage
7. User can download PDFs
```

**Cookie settings:**
- `httpOnly: true` — No JS access (XSS protection)
- `secure: true` — HTTPS only
- `sameSite: 'strict'` — CSRF protection
- `maxAge`: 7 days (configurable)

---

## 6. PDF Generation Strategy

**Option A: Playwright**
- Render HTML template in headless browser
- Print to PDF (A4)
- Pros: Full CSS support, complex layouts
- Cons: Heavier dependency, slower

**Option B: pdf-lib**
- Create PDF programmatically
- Pros: Lightweight, fast
- Cons: Manual layout, limited styling

**Recommendation for MVP:** Use **@react-pdf/renderer** or **Playwright** for HTML-to-PDF. Document content is assembled from text modules; HTML templates are easier to maintain for legal documents.

**Flow:**
1. Backend receives answers
2. Content modules (e.g. `patientenverfuegung.ts`) compose text from answers
3. HTML template populated with composed text
4. Playwright renders HTML → PDF
5. Return PDF as download

---

## 7. Content Modules

Documents are assembled from TypeScript modules:

```typescript
// content/de/patientenverfuegung.ts
export function composePatientenverfuegung(answers: Answers): string {
  const sections: string[] = [];
  sections.push(preamble(answers.personalInfo));
  sections.push(trustedPersonSection(answers.trustedPerson));
  sections.push(medicalPreferencesSection(answers.medicalPreferences));
  sections.push(scenarioSection(answers.scenarios));
  sections.push(valuesSection(answers.values));
  return sections.join('\n\n');
}
```

Each module:
- Takes `Answers` (typed)
- Returns full document text (or structured sections)
- Versioned via schema — old documents use stored schema version

---

## 8. Deployment (Docker)

```
docker-compose.yml
├── frontend (build + serve via nginx or static)
├── backend (Node.js)
├── postgres
└── (optional) playwright for PDF
```

---

## 9. Environment Variables

**Backend:**
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for signing JWTs
- `NODE_ENV` — development | production
- `FRONTEND_URL` — CORS origin

**Frontend:**
- `VITE_API_URL` — Backend API base URL
