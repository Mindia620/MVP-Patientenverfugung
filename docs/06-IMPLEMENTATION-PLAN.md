# Implementation Plan — Vorsorge Wizard

**Version:** 1.0  
**Target: MVP Complete**

---

## Implementation Steps

### Step 1 — Project Scaffolding
- Monorepo structure setup
- Frontend: Vite + React + TypeScript + Tailwind
- Backend: Node.js + Express + TypeScript
- Docker Compose for local development
- ESLint + Prettier configuration
- Environment variable setup

### Step 2 — Wizard UI (Frontend)
- Wizard layout component (progress indicator, navigation)
- All 8 wizard steps with React Hook Form + Zod validation
- i18n setup (de.json + en.json) with react-i18next
- Tooltip component for medical terms
- Responsive mobile-first design

### Step 3 — Local Draft Persistence
- Zustand store for wizard state
- localStorage persistence (auto-save on every field change)
- Draft restoration on page reload
- Resume-from-step logic

### Step 4 — Authentication
- Backend: register, login, logout routes
- JWT httpOnly cookie implementation
- Frontend: Login and Register pages
- useAuth hook
- Protected route wrapper
- Auth state persistence

### Step 5 — Database Integration
- Prisma schema and migrations
- Draft save/load API routes
- Sync local draft to server on login
- Document package creation

### Step 6 — PDF Generation
- Document content modules (text assemblers) for all 3 document types
- HTML templates for each document
- Playwright-based PDF generation service
- Download endpoints
- Loading states in UI

### Step 7 — Dashboard
- Document list view
- Download all documents
- Start new version
- Account deletion (GDPR)
- Data export (GDPR)

### Step 8 — Security & Polish
- Rate limiting on all endpoints
- Helmet security headers
- CORS configuration
- Input sanitization audit
- Accessibility audit
- Legal pages (Privacy Policy, Impressum)
- Disclaimer placement review

---

## Technology Versions

```
Node.js:      20 LTS
TypeScript:   5.x
React:        18.x
Vite:         5.x
Tailwind:     3.x
Prisma:       5.x
PostgreSQL:   15
Express:      4.x
Playwright:   1.x
Zustand:      4.x
React Router: 6.x
React i18next: 14.x
Zod:          3.x
React Hook Form: 7.x
```
