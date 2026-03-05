# Vorsorge Wizard — Implementation Roadmap

**Version:** 1.0  
**Date:** March 2025

---

## Overview

This roadmap guides the incremental implementation of the Vorsorge Wizard MVP. Each step builds on the previous one. Do not skip steps.

---

## Step 1 — Project Scaffolding

**Goal:** Monorepo structure with frontend, backend, and Docker.

**Tasks:**
- [ ] Create `frontend/` with Vite + React + TypeScript
- [ ] Create `backend/` with Express + TypeScript
- [ ] Configure Tailwind, ESLint, Prettier
- [ ] Add `docker/` with Dockerfile for frontend, backend, PostgreSQL
- [ ] Create `docker-compose.yml` for local development
- [ ] Add shared types package or copy types between frontend/backend
- [ ] Basic README with setup instructions

**Deliverables:** Empty apps that run; `npm run dev` works for both.

---

## Step 2 — Wizard UI

**Goal:** Complete wizard flow with all steps, no persistence.

**Tasks:**
- [ ] Set up React Router, routes for `/`, `/wizard`, `/wizard/:step`
- [ ] Implement Intro page with disclaimer
- [ ] Implement Step 1 (Personal Information) with React Hook Form + Zod
- [ ] Implement Step 2 (Trusted Person)
- [ ] Implement Step 3 (Medical Preferences) with tooltips
- [ ] Implement Step 4 (Situational Scenarios)
- [ ] Implement Step 5 (Optional wishes)
- [ ] Implement Step 6 (Summary & Review)
- [ ] Implement Step 7 (Create Account) — UI only, no API yet
- [ ] Implement Step 8 (Generate PDF) — placeholder, no API yet
- [ ] Add progress indicator
- [ ] Add i18n (DE + EN) with react-i18next
- [ ] Responsive layout, accessibility basics

**Deliverables:** User can click through entire wizard; form validation works.

---

## Step 3 — Local Draft Persistence

**Goal:** Save and restore wizard state in localStorage.

**Tasks:**
- [ ] Define `WizardAnswers` type (shared)
- [ ] Create hook `useWizardDraft()` — load from localStorage, save on change
- [ ] Integrate with React Hook Form (defaultValues from draft, watch + debounce save)
- [ ] Add "Clear draft" option (e.g., in settings or footer)
- [ ] Handle migration if schema changes (version in localStorage)

**Deliverables:** Refresh page → wizard state restored.

---

## Step 4 — Authentication

**Goal:** Register, login, logout with JWT in httpOnly cookies.

**Tasks:**
- [ ] Prisma schema: User model
- [ ] Run migrations
- [ ] POST /api/auth/register — hash password, create user, set JWT cookie
- [ ] POST /api/auth/login — verify password, set JWT cookie
- [ ] POST /api/auth/logout — clear cookie
- [ ] GET /api/auth/me — return current user from JWT
- [ ] Auth middleware for protected routes
- [ ] Frontend: auth context, login/register forms, redirect after auth

**Deliverables:** User can create account and sign in; protected routes work.

---

## Step 5 — Database Integration

**Goal:** Save document packages, fetch for dashboard.

**Tasks:**
- [ ] Prisma schema: Answers, DocumentPackage, GeneratedDocument
- [ ] Run migrations
- [ ] POST /api/documents — create DocumentPackage + Answers from wizard data
- [ ] GET /api/documents — list user's packages
- [ ] GET /api/documents/:id — get single package with answers
- [ ] DELETE /api/documents/:id — delete package (cascade)
- [ ] Frontend: submit wizard data to API after Step 7 (account creation)
- [ ] Store wizardVersion in request (e.g., "1.0")

**Deliverables:** Completed wizard → data saved to DB; user can see list of saved packages.

---

## Step 6 — PDF Generation

**Goal:** Generate and download PDFs for each document type.

**Tasks:**
- [ ] Create content modules: `patientenverfuegung.ts`, `vorsorgevollmacht.ts`, `betreuungsverfuegung.ts`
- [ ] Each module: `render(answers: Answers): string` (HTML)
- [ ] Set up Playwright (or Puppeteer) for HTML → PDF
- [ ] GET /api/documents/:id/pdf/:type — generate PDF, return as stream
- [ ] Document types: patientenverfuegung, vorsorgevollmacht, betreuungsverfuegung
- [ ] Frontend: download buttons on Step 8 and dashboard
- [ ] Optional: pre-generate on save and store in GeneratedDocument; or generate on-demand

**Deliverables:** User can download PDFs for all three document types.

---

## Step 7 — Dashboard

**Goal:** User can view saved packages and re-download PDFs.

**Tasks:**
- [ ] Dashboard page: list of DocumentPackages (date, maybe preview)
- [ ] Link to download PDFs for each package
- [ ] Delete package option
- [ ] Navigation: Wizard, Dashboard, Logout

**Deliverables:** Full user flow: wizard → save → dashboard → download.

---

## Step 8 — Security Improvements

**Goal:** Harden for production.

**Tasks:**
- [ ] Rate limiting on auth endpoints
- [ ] CORS configuration
- [ ] Helmet.js for security headers
- [ ] Input validation on all endpoints (Zod)
- [ ] Account deletion endpoint (GDPR)
- [ ] Error handling: no stack traces in production
- [ ] Logging: structured, no sensitive data

**Deliverables:** Production-ready security posture.

---

## Dependency Order

```
Step 1 (Scaffolding)
    ↓
Step 2 (Wizard UI) ────────────────────────────────────────┐
    ↓                                                         │
Step 3 (Local Draft)                                          │
    ↓                                                         │
Step 4 (Auth) ←──────────────────────────────────────────────┤
    ↓                                                         │
Step 5 (DB) ←─────────────────────────────────────────────────┤
    ↓                                                         │
Step 6 (PDF) ←─────────────────────────────────────────────────┤
    ↓                                                         │
Step 7 (Dashboard)                                             │
    ↓                                                         │
Step 8 (Security)                                              │
```

---

## Estimated Effort (Rough)

| Step | Effort |
|------|--------|
| 1 | 1–2 hours |
| 2 | 4–6 hours |
| 3 | 1–2 hours |
| 4 | 2–3 hours |
| 5 | 2–3 hours |
| 6 | 3–4 hours |
| 7 | 1–2 hours |
| 8 | 1–2 hours |
| **Total** | **~15–24 hours** |

---

## Testing Strategy

- **Unit:** Zod schemas, content modules
- **Integration:** API routes with test DB
- **E2E:** Playwright for critical flows (wizard completion, auth, PDF download)

---

## Definition of Done (MVP)

- [ ] Anonymous user can complete wizard
- [ ] User must create account to save
- [ ] Three PDFs generated and downloadable
- [ ] UI in German and English
- [ ] Disclaimers in place
- [ ] Responsive layout
- [ ] Medical term tooltips
- [ ] Document versioning (wizardVersion stored)
