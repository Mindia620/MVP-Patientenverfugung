# Vorsorge Wizard — System Architecture

**Version:** 1.0  
**Date:** March 2025

---

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  React + Vite + TypeScript + Tailwind                                 │   │
│  │  • Wizard UI (React Hook Form + Zod)                                  │   │
│  │  • i18n (DE/EN)                                                       │   │
│  │  • localStorage draft persistence                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS / REST API
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Node.js)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Express + Prisma + PostgreSQL                                        │   │
│  │  • Auth (JWT in httpOnly cookies)                                     │   │
│  │  • Document CRUD                                                       │   │
│  │  • PDF generation (Playwright / HTML → PDF)                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PostgreSQL                                                                  │
│  • Users, DocumentPackages, Answers, GeneratedDocuments                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool, fast HMR |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **React Hook Form** | Form state, validation, performance |
| **Zod** | Schema validation (shared with backend) |
| **react-i18next** | Internationalization (DE, EN) |

### 2.1 Frontend Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level pages
│   ├── wizard/           # Wizard steps and flow logic
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities, API client
│   ├── i18n/             # Translation files
│   ├── types/            # Shared TypeScript types
│   └── App.tsx
├── public/
└── index.html
```

### 2.2 State Management

- **Wizard state:** React Hook Form (form context)
- **Auth state:** Context + cookie-based (no client-side JWT storage)
- **Draft persistence:** localStorage, keyed by `vorsorge-wizard-draft`
- **No Redux/Zustand** for MVP — keep it simple

---

## 3. Backend Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | HTTP server, routing, middleware |
| **Prisma** | ORM, migrations, type-safe DB access |
| **PostgreSQL** | Primary database |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT creation/verification |
| **Playwright** or **puppeteer** | HTML → PDF (headless browser) |

### 3.1 Backend Structure

```
backend/
├── src/
│   ├── routes/           # Express route handlers
│   │   ├── auth.ts
│   │   ├── documents.ts
│   │   └── pdf.ts
│   ├── middleware/       # Auth, validation, error handling
│   ├── services/         # Business logic
│   │   ├── pdf.service.ts
│   │   └── document.service.ts
│   ├── content/          # Document text modules (DE)
│   │   ├── patientenverfuegung.ts
│   │   ├── vorsorgevollmacht.ts
│   │   └── betreuungsverfuegung.ts
│   ├── lib/              # Prisma client, utils
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── package.json
```

---

## 4. API Design

### 4.1 REST Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | Yes | Sign out (clear cookie) |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/documents` | Yes | Save document package |
| GET | `/api/documents` | Yes | List user's document packages |
| GET | `/api/documents/:id` | Yes | Get single package |
| DELETE | `/api/documents/:id` | Yes | Delete package |
| GET | `/api/documents/:id/pdf/:type` | Yes | Download PDF (patientenverfuegung, vorsorgevollmacht, betreuungsverfuegung) |

### 4.2 Request/Response Examples

**POST /api/auth/register**
```json
// Request
{ "email": "user@example.com", "password": "securePassword123" }

// Response
{ "user": { "id": "uuid", "email": "user@example.com" } }
// + Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict
```

**POST /api/documents**
```json
// Request
{
  "wizardVersion": "1.0",
  "answers": { /* full wizard answers object */ }
}

// Response
{ "id": "uuid", "createdAt": "2025-03-05T..." }
```

---

## 5. Authentication

### 5.1 Flow

1. User registers with email + password
2. Backend hashes password (bcrypt, cost 12)
3. Backend creates user, returns JWT
4. JWT stored in **httpOnly, Secure, SameSite=Strict** cookie
5. Frontend sends credentials with `credentials: 'include'` on API calls
6. Backend middleware validates JWT on protected routes

### 5.2 JWT Payload

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

- **Expiry:** 7 days (configurable)
- **Refresh:** Not in MVP; user re-logs in when expired

---

## 6. PDF Generation

### 6.1 Approach

1. **Content modules** (`content/de/patientenverfuegung.ts`, etc.) export a function that takes `Answers` and returns HTML string
2. HTML template includes styling (inline or `<style>` for PDF compatibility)
3. **Playwright** (or Puppeteer) loads HTML, renders to PDF (A4)
4. PDF returned as stream with `Content-Disposition: attachment`

### 6.2 Content Module Interface

```typescript
// content/de/patientenverfuegung.ts
export function renderPatientenverfuegung(answers: Answers): string {
  // Compose HTML from answers
  return `<html>...</html>`;
}
```

### 6.3 PDF Options (Playwright)

- Format: A4
- Print background graphics: true
- Margin: 20mm

---

## 7. Internationalization (i18n)

- **UI:** react-i18next, language stored in localStorage + URL param
- **Documents:** German only for MVP (legal requirement)
- **Translation files:** `frontend/src/i18n/de.json`, `en.json`
- **Namespace:** `common`, `wizard`, `errors`

---

## 8. Deployment (Docker)

```
docker/
├── Dockerfile.frontend
├── Dockerfile.backend
├── docker-compose.yml
└── nginx.conf (optional, for production)
```

- **Frontend:** Build static assets, serve via nginx or CDN
- **Backend:** Node process, connects to PostgreSQL
- **PostgreSQL:** Separate container or managed service

---

## 9. Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | e.g., "7d" |
| `PORT` | Server port (default 3001) |
| `NODE_ENV` | development \| production |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
