# System Architecture — Vorsorge Wizard

**Version:** 1.0

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   React SPA (Vite + TypeScript + Tailwind)                  │
│   ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│   │  Wizard UI   │  │  Dashboard   │  │  Auth Forms    │   │
│   └──────────────┘  └──────────────┘  └────────────────┘   │
│          │                  │                  │            │
│   ┌──────────────────────────────────────────────────────┐  │
│   │           React Query (server state)                 │  │
│   │           Zustand (wizard local state)               │  │
│   │           localStorage (draft persistence)           │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS (REST + JSON)
                          │ httpOnly cookie (JWT)
┌─────────────────────────▼───────────────────────────────────┐
│                  NODE.JS / EXPRESS API                       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────┐   │
│  │  Auth routes│  │  Docs routes│  │  PDF routes       │   │
│  │  /auth/*    │  │  /packages/*│  │  /generate/*      │   │
│  └─────────────┘  └─────────────┘  └───────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Middleware                          │   │
│  │  helmet | cors | rate-limit | validate | auth-guard  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Service Layer                       │   │
│  │  AuthService | DocumentService | PDFService          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Prisma ORM                              │   │
│  └───────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────┘
                               │
              ┌────────────────▼──────────────────┐
              │          PostgreSQL 15             │
              │                                   │
              │  users | document_packages |       │
              │  answers | generated_documents |   │
              │  consent_records                  │
              └───────────────────────────────────┘
```

---

## Directory Structure

```
vorsorge-wizard/
├── frontend/                     # React SPA
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/               # Shared design system components
│   │   │   ├── wizard/           # Wizard step components
│   │   │   └── layout/           # Layout components
│   │   ├── content/
│   │   │   ├── de/               # German document text modules
│   │   │   │   ├── patientenverfuegung.ts
│   │   │   │   ├── vorsorgevollmacht.ts
│   │   │   │   └── betreuungsverfuegung.ts
│   │   │   └── en/               # English equivalents (for UI only)
│   │   ├── hooks/
│   │   ├── i18n/
│   │   │   ├── de.json
│   │   │   └── en.json
│   │   ├── lib/
│   │   │   ├── api.ts            # Axios instance + interceptors
│   │   │   └── validation.ts     # Zod schemas
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Wizard.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── store/
│   │   │   └── wizardStore.ts    # Zustand wizard state
│   │   ├── types/
│   │   └── App.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                      # Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validate.ts
│   │   │   └── rateLimiter.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.router.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.schema.ts
│   │   │   ├── documents/
│   │   │   │   ├── documents.router.ts
│   │   │   │   ├── documents.service.ts
│   │   │   │   └── documents.schema.ts
│   │   │   └── pdf/
│   │   │       ├── pdf.router.ts
│   │   │       ├── pdf.service.ts
│   │   │       └── templates/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── docs/
    ├── PRD.md
    ├── UX_FLOW.md
    ├── ARCHITECTURE.md
    ├── PRIVACY.md
    └── IOS_INTEGRATION.md
```

---

## Frontend Stack

| Concern | Tool | Reason |
|---|---|---|
| Framework | React 18 | Component model, ecosystem |
| Build | Vite 5 | Fast HMR, modern bundler |
| Language | TypeScript 5 | Type safety across wizard forms |
| Styling | Tailwind CSS 3 | Utility-first, consistent design tokens |
| Forms | React Hook Form | Performant, uncontrolled inputs |
| Validation | Zod | Schema-first, shared with backend |
| State (wizard) | Zustand | Lightweight, persist to localStorage |
| Server state | TanStack Query | Caching, loading states, mutations |
| Routing | React Router 6 | SPA routing |
| i18n | react-i18next | DE + EN, lazy-loaded |
| HTTP | Axios | Interceptors, cookie handling |
| Icons | Lucide React | Consistent icon set |

---

## Backend Stack

| Concern | Tool | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS | Stability, long-term support |
| Framework | Express 4 | Minimal, flexible |
| Language | TypeScript 5 | Type safety |
| ORM | Prisma 5 | Type-safe queries, migrations |
| Database | PostgreSQL 15 | ACID, JSON columns for answers |
| Auth | bcrypt + JWT | Industry standard |
| Validation | Zod | Shared schemas with frontend |
| PDF | Playwright (headless Chromium) | High-fidelity HTML→PDF rendering |
| Security | helmet, cors, express-rate-limit | Hardened defaults |

---

## API Design

### Authentication

```
POST /api/auth/register     Create account
POST /api/auth/login        Login, set httpOnly cookie
POST /api/auth/logout       Clear cookie
GET  /api/auth/me           Current user (requires auth)
```

### Document Packages

```
POST /api/packages          Save wizard answers → create package
GET  /api/packages          List all packages for user
GET  /api/packages/:id      Get single package with answers
PUT  /api/packages/:id      Update (re-run wizard)
DELETE /api/packages/:id    Delete package + documents (GDPR)
```

### PDF Generation

```
POST /api/generate/:packageId/patientenverfuegung   Generate PDF
POST /api/generate/:packageId/vorsorgevollmacht      Generate PDF
POST /api/generate/:packageId/betreuungsverfuegung   Generate PDF
POST /api/generate/:packageId/all                    Generate ZIP
GET  /api/generate/:packageId/download/:docId        Download PDF
```

---

## Data Flow

### Anonymous Wizard Flow
```
User fills wizard
  → answers stored in Zustand
  → auto-saved to localStorage every step
  → no server calls
  → on Step 7: user prompted to create account
  → on account creation: answers POSTed to /api/packages
  → redirect to Step 8
```

### PDF Generation Flow
```
Step 8 loaded
  → POST /api/generate/:id/all
  → Backend: fetch answers from DB
  → Backend: call content modules to assemble HTML
  → Backend: Playwright renders HTML → PDF bytes
  → PDFs stored as base64 in generated_documents table
  → Frontend: poll for status, then offer download
```

---

## Security Architecture

### Authentication
- Passwords hashed: bcrypt, cost=12
- JWT: HS256, 7-day expiry, stored in httpOnly Secure SameSite=Strict cookie
- CSRF protection: SameSite=Strict cookie + custom header check
- Rate limiting: 5 failed logins per 15 minutes per IP

### Transport
- HTTPS enforced (HSTS header)
- CORS: allowlist frontend origin only

### API Hardening
- Helmet.js: sets Content-Security-Policy, X-Frame-Options, etc.
- Input validation: Zod on all routes
- SQL injection: impossible via Prisma parameterised queries
- File upload: not present in MVP

### Database
- Encrypted volume (infrastructure)
- Separate DB user per application (least privilege)
- No raw queries

---

## Infrastructure (Docker)

```yaml
services:
  postgres:   official postgres:15-alpine image
  backend:    custom Node.js image, port 4000
  frontend:   nginx serving Vite build, port 80/443
```

Production target: any VPS (Hetzner, etc.) with Docker Compose.

Future: Kubernetes / managed database for scale.
