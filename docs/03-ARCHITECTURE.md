# System Architecture — Vorsorge Wizard

**Version:** 1.0  
**Status:** Approved for Implementation

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet / HTTPS                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────▼───────────────┐
         │        Nginx (Reverse Proxy)   │
         │  - SSL termination             │
         │  - Static asset serving        │
         │  - Rate limiting               │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │      React SPA (Frontend)      │
         │  - Vite build                  │
         │  - TypeScript                  │
         │  - Tailwind CSS                │
         │  - React Hook Form + Zod       │
         │  - i18next (DE + EN)           │
         │  - React Router v6             │
         └───────────────┬───────────────┘
                         │ REST API calls (HTTPS)
         ┌───────────────▼───────────────┐
         │     Express Backend (API)      │
         │  - Node.js 20 LTS              │
         │  - TypeScript                  │
         │  - Prisma ORM                  │
         │  - JWT (httpOnly cookies)      │
         │  - bcrypt password hashing     │
         │  - Zod request validation      │
         │  - PDF generation service      │
         └──────┬────────────────┬────────┘
                │                │
   ┌────────────▼──┐    ┌────────▼────────────┐
   │  PostgreSQL    │    │  PDF Generator       │
   │  (Prisma ORM)  │    │  (Playwright/        │
   │                │    │   html-pdf-node)     │
   └────────────────┘    └─────────────────────┘
```

---

## 2. Repository Structure

```
vorsorge-wizard/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # Shared UI components
│   │   │   ├── ui/              # Primitives: Button, Input, Card, Tooltip
│   │   │   ├── wizard/          # WizardLayout, StepIndicator, StepNav
│   │   │   └── layout/          # AppHeader, AppFooter, PageLayout
│   │   ├── pages/               # Route-level components
│   │   │   ├── wizard/          # Steps 1–8
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── dashboard/       # Dashboard, DocumentView
│   │   │   └── Home.tsx         # Landing / Intro
│   │   ├── store/               # Zustand global state (wizard draft)
│   │   ├── hooks/               # useWizard, useAuth, useDraft
│   │   ├── lib/                 # api client, validation schemas
│   │   ├── locales/             # de.json, en.json
│   │   ├── types/               # Shared TypeScript types
│   │   └── content/             # Document text modules
│   │       ├── de/
│   │       │   ├── patientenverfuegung.ts
│   │       │   ├── vorsorgevollmacht.ts
│   │       │   └── betreuungsverfuegung.ts
│   │       └── en/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── routes/              # auth, wizard, documents, users
│   │   ├── middleware/          # auth guard, rate limiter, error handler
│   │   ├── services/            # pdf.service, document.service
│   │   ├── lib/                 # prisma client, jwt helpers
│   │   ├── types/               # Express request extensions
│   │   └── index.ts             # Entry point
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tsconfig.json
│
├── docker/
│   ├── docker-compose.yml       # Full stack orchestration
│   ├── docker-compose.dev.yml   # Development overrides
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
└── docs/                        # This documentation
```

---

## 3. Frontend Architecture

### State Management Strategy

```
┌────────────────────────────────────────────────────┐
│                  Application State                  │
├───────────────────┬────────────────────────────────┤
│   Wizard Draft    │   Auth State                   │
│   (Zustand)       │   (Zustand + httpOnly cookie)  │
│   + localStorage  │                                │
│   persistence     │                                │
├───────────────────┴────────────────────────────────┤
│   Server State: React Query (API cache/sync)        │
└────────────────────────────────────────────────────┘
```

### Route Structure

```
/                         → Home / Intro
/wizard/step/:step        → Wizard Steps 1–8
/auth/login               → Login
/auth/register            → Register
/dashboard                → Dashboard (protected)
/dashboard/documents/:id  → Document Detail (protected)
/privacy                  → Privacy Policy
/imprint                  → Impressum (required by German law)
```

### Form Architecture

Each wizard step uses React Hook Form with a Zod schema resolver.
The wizard state is managed globally via Zustand and persisted to
localStorage on every field change. This enables:
- Anonymous usage with no account required
- Browser refresh survival
- Resume from any step

---

## 4. Backend Architecture

### API Routes

```
POST   /api/auth/register        Create account
POST   /api/auth/login           Login, set JWT cookie
POST   /api/auth/logout          Clear JWT cookie
GET    /api/auth/me              Get current user

POST   /api/wizard/draft         Save/update wizard draft
GET    /api/wizard/draft         Get current user's draft

POST   /api/documents/generate   Generate document package
GET    /api/documents            List user's document packages
GET    /api/documents/:id        Get document package
GET    /api/documents/:id/pdf/:type  Download specific PDF

DELETE /api/users/me             Delete account + all data (GDPR)
GET    /api/users/me/export      Export all user data (GDPR)
```

### Middleware Stack

```
Request
  → CORS (frontend origin whitelist)
  → Helmet (security headers)
  → Rate Limiter (express-rate-limit)
  → Cookie Parser
  → JSON Body Parser
  → Auth Middleware (JWT verification, attaches user to req)
  → Route Handler
  → Error Handler
  → Response
```

### PDF Generation Flow

```
POST /api/documents/generate
  1. Validate user authentication
  2. Load wizard answers from database (or request body for anonymous)
  3. Compose document text from content modules
  4. Render HTML template with composed text
  5. Generate PDF via Playwright (headless Chromium)
  6. Store PDF binary in database (or S3 in future)
  7. Return signed download URLs
```

---

## 5. Database Architecture

### Technology: PostgreSQL 15 via Prisma ORM

**Rationale:**
- Relational structure fits hierarchical document packages
- JSONB support for flexible answer storage
- Strong consistency guarantees for financial/legal data
- Excellent Prisma support

### Connection Pooling
- PgBouncer in production (connection pool size: 20)
- Prisma connection limit configured via `DATABASE_URL` connection pool params

---

## 6. Authentication Architecture

### Flow: Email + Password with JWT (httpOnly cookie)

```
Register:
  Client → POST /auth/register { email, password }
  Server: bcrypt hash password (12 rounds)
  Server: create User in DB
  Server: generate JWT (payload: { userId, email })
  Server: set-cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=7d
  Response: 201 { user: { id, email } }

Login:
  Client → POST /auth/login { email, password }
  Server: find user by email
  Server: bcrypt.compare(password, hash)
  Server: generate JWT
  Server: set-cookie
  Response: 200 { user: { id, email } }

Protected Request:
  Client sends cookie automatically (same-origin)
  Server middleware: jwt.verify(req.cookies.token, secret)
  Server: attaches user to req.user
  Route handler: accesses req.user.id

Logout:
  Client → POST /auth/logout
  Server: set-cookie with Max-Age=0 (clears cookie)
  Response: 200
```

### JWT Configuration
- Algorithm: HS256
- Expiry: 7 days
- Secret: 256-bit random, from environment variable
- Payload: `{ userId: string, email: string, iat: number, exp: number }`

---

## 7. PDF Generation Architecture

### Technology Selection: `@playwright/test` (Headless Chromium)

**Rationale over alternatives:**
- `pdf-lib`: Complex layout for legal A4 documents
- `pdfmake`: Limited HTML support
- `puppeteer`: Very similar but Playwright has better lifecycle management
- `wkhtmltopdf`: Outdated, hard to containerize

### Process

1. Express route receives generate request
2. Document service assembles HTML string from text modules + user data
3. Playwright launches headless Chromium (persistent browser instance)
4. Page navigates to `data:text/html,<html>...</html>`
5. PDF exported with A4 format, print media type, proper margins
6. Buffer returned to route handler
7. Stored in DB as base64, served as download

### HTML Template

Each document type has an HTML template using:
- Print-optimized CSS (`@media print`)
- Proper A4 page breaks
- German legal document formatting conventions
- Footer with generation date and disclaimer
- Signature lines at bottom

---

## 8. Security Architecture

### OWASP Top 10 Mitigations

| Threat | Mitigation |
|--------|-----------|
| Injection | Prisma parameterized queries, Zod input validation |
| Broken Auth | httpOnly cookies, bcrypt 12 rounds, JWT expiry |
| XSS | React (JSX escaping), CSP headers via Helmet |
| CSRF | SameSite=Strict cookies, CORS whitelist |
| Security Misconfiguration | Helmet defaults, env var secrets |
| Sensitive Data Exposure | HTTPS only, no sensitive data in logs |
| Rate Limiting | express-rate-limit on all endpoints |

### Content Security Policy
```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
```

---

## 9. Infrastructure

### Docker Compose (Development)
```
services:
  postgres:    PostgreSQL 15 (port 5432)
  backend:     Express API (port 3001) with hot reload
  frontend:    Vite dev server (port 5173) with HMR
```

### Docker Compose (Production)
```
services:
  postgres:    PostgreSQL 15 with persistent volume
  backend:     Express API (port 3001)
  frontend:    Nginx serving Vite build + proxy to backend
```
