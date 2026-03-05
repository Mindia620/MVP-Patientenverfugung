# Vorsorge Wizard — System Architecture

**Version:** 1.0
**Date:** 2026-03-05

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React + Vite + TypeScript + Tailwind                 │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────────────┐ │  │
│  │  │ Wizard   │ │ Auth     │ │ Dashboard             │ │  │
│  │  │ (7 steps)│ │ Pages    │ │ (documents, settings) │ │  │
│  │  └──────────┘ └──────────┘ └───────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ State: React Hook Form + Zod + localStorage      │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ i18n: react-i18next (DE / EN)                    │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS (REST API)
                          │ JWT in httpOnly cookies
┌─────────────────────────▼───────────────────────────────────┐
│                        SERVER                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Node.js + Express + TypeScript                       │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │  │ Auth API │ │ Docs API │ │ PDF API  │             │  │
│  │  └──────────┘ └──────────┘ └──────────┘             │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ Middleware: auth, validation, rate-limit, CORS   │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ Prisma ORM                                       │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ PDF Generator (pdf-lib)                          │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      DATABASE                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 16                                        │  │
│  │  - Users                                              │  │
│  │  - DocumentPackages                                   │  │
│  │  - Answers (versioned)                                │  │
│  │  - GeneratedDocuments (metadata + storage path)       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI framework | 18.x |
| Vite | Build tool | 5.x |
| TypeScript | Type safety | 5.x |
| Tailwind CSS | Styling | 3.x |
| React Hook Form | Form state | 7.x |
| Zod | Schema validation | 3.x |
| react-i18next | Internationalization | 14.x |
| React Router | Client-side routing | 6.x |
| Lucide React | Icons | latest |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| Node.js | Runtime | 20 LTS |
| Express | HTTP framework | 4.x |
| TypeScript | Type safety | 5.x |
| Prisma | ORM + migrations | 5.x |
| PostgreSQL | Database | 16 |
| bcrypt | Password hashing | 5.x |
| jsonwebtoken | JWT tokens | 9.x |
| pdf-lib | PDF generation | 1.x |
| zod | Server-side validation | 3.x |
| helmet | Security headers | 7.x |
| cors | CORS configuration | 2.x |
| express-rate-limit | Rate limiting | 7.x |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Local development |
| Nginx | Reverse proxy (production) |

---

## 3. API Design

### Authentication Endpoints
```
POST   /api/auth/register    — Create account
POST   /api/auth/login       — Sign in
POST   /api/auth/logout      — Sign out (clear cookie)
GET    /api/auth/me          — Get current user
```

### Document Endpoints
```
POST   /api/documents        — Save wizard answers + create package
GET    /api/documents        — List user's document packages
GET    /api/documents/:id    — Get specific package with answers
PUT    /api/documents/:id    — Update answers for a package
DELETE /api/documents/:id    — Delete a document package
```

### PDF Endpoints
```
POST   /api/documents/:id/generate   — Generate PDFs for a package
GET    /api/documents/:id/pdf/:type  — Download a specific PDF
```

### Health
```
GET    /api/health           — Server health check
```

---

## 4. Authentication Flow

```
1. User completes wizard anonymously (data in localStorage)
2. User reaches Step 7 (Account Creation)
3. User registers → POST /api/auth/register
4. Server creates user, returns JWT in httpOnly cookie
5. Client sends wizard data → POST /api/documents
6. Server stores answers, creates DocumentPackage
7. All subsequent requests include cookie automatically
```

### JWT Structure
```json
{
  "sub": "user-uuid",
  "iat": 1709654400,
  "exp": 1709740800
}
```

- Access token: 24h expiry
- Stored in httpOnly, Secure, SameSite=Strict cookie
- No refresh tokens in MVP (user re-authenticates)

---

## 5. PDF Generation Architecture

```
User Answers
    ↓
Content Modules (text templates per document type)
    ↓
Document Assembler (combines templates + answers)
    ↓
HTML Template (styled for A4)
    ↓
pdf-lib (generates PDF buffer)
    ↓
Storage (filesystem in MVP, S3-compatible in production)
    ↓
Download endpoint (streams file to client)
```

### Content Module Structure
Each document type has a TypeScript module that:
1. Accepts the user's answers as typed input
2. Selects appropriate text blocks based on answers
3. Returns structured sections for the document
4. Includes legal preamble, body, and closing sections

---

## 6. Folder Structure

```
vorsorge-wizard/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── wizard/          # Wizard step components
│   │   │   └── layout/          # Header, Footer, Layout
│   │   ├── pages/               # Route pages
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utilities, API client
│   │   ├── i18n/                # Translation files
│   │   │   ├── de.json
│   │   │   └── en.json
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── types/               # TypeScript types
│   │   ├── store/               # State management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/              # Express routes
│   │   ├── middleware/          # Auth, validation, etc.
│   │   ├── services/            # Business logic
│   │   ├── content/             # Document text modules
│   │   │   └── de/
│   │   │       ├── patientenverfuegung.ts
│   │   │       ├── vorsorgevollmacht.ts
│   │   │       └── betreuungsverfuegung.ts
│   │   ├── pdf/                 # PDF generation
│   │   ├── lib/                 # Utilities
│   │   ├── types/               # Shared types
│   │   └── index.ts             # Entry point
│   ├── prisma/
│   │   └── schema.prisma
│   ├── tsconfig.json
│   └── package.json
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── docs/
│   ├── 01-PRD.md
│   ├── 02-UX-WIZARD-FLOW.md
│   ├── 03-SYSTEM-ARCHITECTURE.md
│   ├── 04-DATA-MODEL.md
│   ├── 05-PRIVACY-ARCHITECTURE.md
│   ├── 06-IMPLEMENTATION-PLAN.md
│   └── 07-IOS-INTEGRATION.md
└── README.md
```

---

## 7. Environment Configuration

### Development
```env
# Backend
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vorsorge
JWT_SECRET=dev-secret-change-in-production
PORT=3001
CORS_ORIGIN=http://localhost:5173
PDF_STORAGE_PATH=./storage/pdfs

# Frontend
VITE_API_URL=http://localhost:3001/api
```

### Production Considerations
- All secrets via environment variables (never in code)
- DATABASE_URL with SSL required
- JWT_SECRET minimum 256-bit random
- CORS_ORIGIN set to production domain only
- Rate limiting tuned for production load
