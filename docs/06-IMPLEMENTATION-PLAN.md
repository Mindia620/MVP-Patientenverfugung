# Vorsorge Wizard — Implementation Plan

**Version:** 1.0
**Date:** 2026-03-05

---

## Implementation Roadmap

### Step 1: Project Scaffolding
- Initialize monorepo structure (frontend/ + backend/ + docker/)
- Frontend: Vite + React + TypeScript + Tailwind
- Backend: Node.js + Express + TypeScript + Prisma
- Docker Compose for PostgreSQL
- ESLint + Prettier configuration
- Environment variable setup

### Step 2: Wizard UI
- React Router setup with wizard routes
- Wizard layout component with progress bar
- Step components (Steps 1–6) with React Hook Form
- Zod validation schemas for each step
- Responsive design with Tailwind
- Medical term tooltips
- Navigation (back/next) with validation gates

### Step 3: Local Draft Persistence
- localStorage adapter for wizard state
- Auto-save on step navigation
- Restore draft on page reload
- Clear draft on completion

### Step 4: i18n Setup
- react-i18next configuration
- German translation file (primary)
- English translation file
- Language switcher component
- All wizard labels, buttons, tooltips translated

### Step 5: Authentication
- Backend: auth routes (register, login, logout, me)
- Password hashing with bcrypt
- JWT generation and cookie setting
- Auth middleware for protected routes
- Frontend: auth pages (register, login)
- Auth context/hook for state management
- Protected route wrapper

### Step 6: Database Integration
- Prisma schema (as designed in Phase 4)
- Database migrations
- Document CRUD API endpoints
- Sync local draft to server after auth
- Error handling and validation

### Step 7: PDF Generation
- Content modules for three document types (German)
- Document assembly from answers
- PDF generation with pdf-lib
- A4 formatting with proper typography
- Storage and download endpoints
- Generation progress UI

### Step 8: Dashboard
- Document packages list
- Download buttons per document
- Re-generate option
- Account settings (password change, delete account)
- Logout functionality

---

## Dependency Order

```
Step 1 (Scaffolding)
  ↓
Step 2 (Wizard UI) ←── Step 4 (i18n)
  ↓
Step 3 (Draft Persistence)
  ↓
Step 5 (Auth)
  ↓
Step 6 (Database)
  ↓
Step 7 (PDF Generation)
  ↓
Step 8 (Dashboard)
```
