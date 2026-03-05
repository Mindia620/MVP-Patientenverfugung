# Vorsorge Wizard — Implementation Roadmap

**Version:** 1.0  
**Date:** March 2025

---

## Overview

Incremental implementation in 8 steps. Each step produces a working increment.

---

## Step 1: Project Scaffolding

**Goal:** Monorepo structure with frontend, backend, Docker.

**Tasks:**
- [ ] Create `frontend/` — Vite + React + TypeScript
- [ ] Create `backend/` — Express + TypeScript
- [ ] Create `docker/` — Dockerfile(s), docker-compose.yml
- [ ] Configure ESLint, Prettier
- [ ] Root package.json with workspaces (optional)
- [ ] Environment variable templates (.env.example)

**Deliverable:** `npm run dev` starts both frontend and backend.

---

## Step 2: Wizard UI

**Goal:** Complete wizard flow with all steps, no persistence.

**Tasks:**
- [ ] Set up React Router, Tailwind, i18n
- [ ] Create wizard layout (progress bar, step container)
- [ ] Implement each step component:
  - Intro
  - Personal Information
  - Trusted Person
  - Medical Preferences (with tooltips)
  - Situational Scenarios
  - Values and Wishes
  - Summary & Review
- [ ] React Hook Form + Zod for each step
- [ ] DE/EN translations for all UI strings
- [ ] Responsive design, accessibility basics

**Deliverable:** User can complete wizard; state in React state only.

---

## Step 3: Local Draft Persistence

**Goal:** Save/restore wizard state in localStorage.

**Tasks:**
- [ ] Create `useWizardDraft` hook
- [ ] Save to localStorage on each step (debounced)
- [ ] Restore on mount; "Resume" option on intro
- [ ] Clear draft on completion or "Start over"
- [ ] Handle schema version in draft

**Deliverable:** User can leave and resume wizard.

---

## Step 4: Authentication

**Goal:** Register, login, JWT in httpOnly cookie.

**Tasks:**
- [ ] User model, Prisma migration
- [ ] POST /api/auth/register (bcrypt, create user)
- [ ] POST /api/auth/login (verify, set cookie)
- [ ] POST /api/auth/logout (clear cookie)
- [ ] GET /api/auth/me (return user if authenticated)
- [ ] Auth middleware for protected routes
- [ ] Frontend: auth context, login/register forms
- [ ] CORS, cookie config (sameSite, secure)

**Deliverable:** User can create account and log in.

---

## Step 5: Database Integration

**Goal:** Save document packages, list, fetch.

**Tasks:**
- [ ] DocumentPackage, GeneratedDocument models
- [ ] Prisma migrations
- [ ] POST /api/documents — save package (auth required)
- [ ] GET /api/documents — list user's packages
- [ ] GET /api/documents/:id — get single package
- [ ] DELETE /api/documents/:id — delete (GDPR)
- [ ] Frontend: "Save" flow after account creation
- [ ] Dashboard placeholder (list packages)

**Deliverable:** User can save documents to account.

---

## Step 6: PDF Generation

**Goal:** Generate A4 PDFs from answers.

**Tasks:**
- [ ] Create content modules (patientenverfuegung, vorsorgevollmacht, betreuungsverfuegung)
- [ ] HTML templates for each document type
- [ ] Playwright or pdf-lib integration
- [ ] POST /api/pdf/generate — accepts answers, returns PDF
- [ ] Support anonymous (no save) and authenticated (optional save)
- [ ] Download buttons on frontend
- [ ] "Download all" as ZIP (optional)

**Deliverable:** User can download PDF documents.

---

## Step 7: Dashboard

**Goal:** View saved packages, re-download PDFs.

**Tasks:**
- [ ] Dashboard page (protected)
- [ ] List document packages with dates
- [ ] Re-generate PDF for existing package
- [ ] Delete package
- [ ] Navigation: Wizard, Dashboard, Logout

**Deliverable:** Full user flow from wizard to dashboard.

---

## Step 8: Security Improvements

**Goal:** Harden for production.

**Tasks:**
- [ ] Rate limiting (express-rate-limit)
- [ ] Input sanitization
- [ ] Security headers (helmet)
- [ ] Error handling (no stack traces to client)
- [ ] Logging (structured, no PII)
- [ ] HTTPS redirect (production)
- [ ] Review OWASP Top 10

**Deliverable:** Production-ready security posture.

---

## Dependencies Summary

```
Step 1 → Step 2 (scaffolding enables wizard)
Step 2 → Step 3 (wizard enables draft)
Step 3 → Step 4 (draft enables auth flow)
Step 4 → Step 5 (auth enables save)
Step 5 → Step 6 (DB enables PDF for saved docs)
Step 6 → Step 7 (PDF enables dashboard downloads)
Step 7 → Step 8 (full app enables security review)
```

---

## Estimated Effort (Rough)

| Step | Effort |
|------|--------|
| 1. Scaffolding | 1–2 hours |
| 2. Wizard UI | 4–6 hours |
| 3. Draft persistence | 1 hour |
| 4. Authentication | 2–3 hours |
| 5. Database | 2–3 hours |
| 6. PDF generation | 3–4 hours |
| 7. Dashboard | 1–2 hours |
| 8. Security | 1–2 hours |

**Total:** ~15–23 hours
