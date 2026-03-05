# Vorsorge Wizard — MVP Product & System Plan

## 1) Product Requirements Document (PRD)

### 1.1 Problem statement
Private individuals in Germany often delay creating advance directive documents because the process feels legally complex, medically intimidating, and administratively fragmented. Existing options can be:

- hard to understand for non-experts,
- not privacy-transparent,
- not optimized for guided completion,
- weakly structured for future updates and revisions.

**Vorsorge Wizard** solves this by guiding users through a clear, low-friction flow that helps them produce legally structured German drafts of:

1. Patientenverfügung
2. Vorsorgevollmacht
3. Betreuungsverfügung

The MVP prioritizes clarity, trust, accessibility, and privacy-by-design.

### 1.2 Target users
- Adults in Germany (DE primary, EN secondary UI language support).
- People creating advance directives for the first time.
- Users who want guided explanations of medical/legal choices.
- Family-oriented users who want to assign trusted representatives.

### 1.3 Key features (MVP)
1. **Anonymous wizard mode**
   - Users can complete the flow without account creation.
   - Draft answers are stored locally in browser storage.

2. **Guided multi-step flow**
   - Progressive steps with minimal cognitive load.
   - Contextual helper copy and tooltips for medical terms.
   - Optional sections clearly marked.

3. **Structured document assembly**
   - Modular legal text templates by document type.
   - User answers mapped into template variables.
   - Versioned schema/template metadata per generated package.

4. **Account wall only before cloud save**
   - Create account (email/password) before saving documents online.
   - Logged-in dashboard for saved packages and generated PDFs.

5. **PDF generation**
   - Printable A4 PDFs for each document.
   - Documents generated from canonical assembled text.

6. **Bilingual UI**
   - Full DE + EN interface localization.
   - Document legal content produced in German structure for MVP.

7. **Legal and safety disclaimers**
   - Clear statement: not legal advice, not medical advice.
   - Recommendation to review with physician/lawyer as needed.

### 1.4 Non-goals (MVP)
- Notary integration.
- Qualified electronic signatures.
- Deep legal jurisdiction branching per Bundesland.
- Native mobile apps (iOS/Android) implementation.
- Full end-to-end client-side encryption rollout (documented as roadmap only).

### 1.5 Legal disclaimers (must-show areas)
Disclaimers should appear:
- on Intro step,
- before final PDF generation,
- inside generated documents footer.

Core language:
- This service provides structured document drafting support only.
- It does not replace individualized legal or medical advice.
- Users are responsible for reviewing, signing, dating, and sharing documents appropriately.

### 1.6 Security considerations (GDPR context)
- Data minimization: only collect required fields for document generation.
- Explicit consent for data processing in account creation and save flow.
- Transparent retention policy and deletion controls.
- HTTPS-only transport in production.
- Passwords hashed with bcrypt.
- JWT auth via `httpOnly`, `secure`, `sameSite` cookies.
- Server-side input validation (Zod) and output sanitization.
- Access control: users can only access their own document packages.
- Database backups encrypted at rest (operational requirement).
- Privacy policy + processing purpose documentation from day one.

### 1.7 Success metrics (MVP)
- Wizard completion rate.
- Drop-off per step.
- Account conversion rate at save gate.
- PDF generation success rate.
- Time-to-complete median.

### 1.8 Future roadmap (product)
- Guided signature checklist and witness workflow.
- Shared family access controls.
- Physician handoff packet export.
- Reminder system for periodic review (e.g., every 12 months).
- Fine-grained legal module updates with migration tooling.

---

## 2) UX Design — Wizard Flow

### 2.1 UX principles
- Low cognitive load (one focused step at a time).
- Trust-building tone, plain language.
- Accessible interaction patterns (keyboard, ARIA, contrast).
- Progressive disclosure for sensitive medical choices.

### 2.2 Step flow
0. **Intro**
   - Explain purpose, disclaimer, estimated duration, privacy summary.
   - Actions: Start wizard, choose language (DE/EN).

1. **Personal Information**
   - Name, birth date, address, optional contact info.
   - Validation and plain-language helper text.

2. **Trusted Person**
   - Representative details and relationship.
   - Alternate contact optional.

3. **Medical Treatment Preferences**
   - Structured controls for:
     - CPR
     - Ventilation
     - Artificial nutrition
     - Dialysis
     - Antibiotics
     - Pain management
   - Tooltips define each term in accessible language.

4. **Situational Scenarios**
   - Preference selections for:
     - terminal illness
     - irreversible unconsciousness
     - severe dementia

5. **Values and Personal Wishes (optional)**
   - Free-text values, beliefs, dignity and care priorities.

6. **Summary & Review**
   - Consolidated answer overview.
   - Edit links for each section.
   - Final disclaimer acknowledgement checkbox.

7. **Create account to save documents**
   - Email/password signup or login.
   - Explain why account is required (secure cloud storage + retrieval).

8. **Generate PDF documents**
   - Generate all three PDFs.
   - Download links + dashboard storage confirmation.

### 2.3 Accessibility details
- Semantic headings per step.
- Visible focus states.
- Form errors with inline text + ARIA announcements.
- Tooltips available by keyboard focus and hover.
- Button labels avoid ambiguity (“Continue to Medical Preferences”).

---

## 3) System Architecture

### 3.1 Frontend
- **Stack**: React + Vite + TypeScript + Tailwind.
- **Forms**: React Hook Form + Zod resolver.
- **State**:
  - in-memory wizard state during session;
  - localStorage draft persistence for anonymous use.
- **i18n**:
  - DE + EN using a lightweight i18n library;
  - translation JSON dictionaries.
- **API integration**:
  - Auth endpoints (register/login/logout/me).
  - Document package endpoints (create/list/get/generate).

### 3.2 Backend
- **Stack**: Node.js + Express + TypeScript.
- **ORM**: Prisma.
- **Database**: PostgreSQL.
- **Auth**:
  - email/password credentials,
  - bcrypt hashing,
  - JWT in `httpOnly` cookies.
- **Validation**:
  - Zod schemas for request payloads.
- **Document assembly**:
  - Content modules in `content/de/*.ts`,
  - engine maps answers => legal text sections.

### 3.3 PDF generation
- MVP: `pdf-lib` generation on A4 pages.
- Input: structured assembled text from legal content modules.
- Output: three PDFs attached to one package snapshot.
- Metadata includes template/schema versions for traceability.

### 3.4 High-level component map
- Frontend:
  - Wizard pages
  - Auth screens
  - Dashboard
  - API client
- Backend:
  - Auth routes/service
  - Packages routes/service
  - PDF service
  - Prisma data access

---

## 4) Data Model (Prisma Design)

### 4.1 Required models
1. **User**
   - id, email, passwordHash, timestamps.

2. **DocumentPackage**
   - id, userId, locale,
   - wizardSchemaVersion,
   - contentTemplateVersion,
   - status, timestamps.

3. **Answers**
   - id, packageId,
   - answers JSON snapshot (versioned schema-compatible payload),
   - schemaVersion,
   - timestamps.

4. **GeneratedDocument**
   - id, packageId, type (PATIENTENVERFUEGUNG / VORSORGEVOLLMACHT / BETREUUNGSVERFUEGUNG),
   - version,
   - fileName,
   - mimeType,
   - pdfData (MVP DB byte storage),
   - contentHash,
   - timestamps.

### 4.2 Versioning strategy
- Every `DocumentPackage` stores:
  - `wizardSchemaVersion` (form/answer schema contract),
  - `contentTemplateVersion` (legal text module version).
- Every answer snapshot stores `schemaVersion`.
- Generated docs keep `version` and `contentHash`.
- Old packages remain renderable even after wizard changes.

---

## 5) Privacy Architecture (MVP + Future)

### 5.1 MVP protections
- Transport: HTTPS in production.
- Auth cookies: `httpOnly`, `secure`, `sameSite=lax`.
- Password storage: bcrypt with strong salt rounds.
- Authorization middleware for per-user package access.
- Strict validation and safe error responses.
- User-initiated deletion endpoint for account + all data.
- Privacy disclosures and consent language in UI.

### 5.2 Future privacy/security roadmap
1. **Client-side encryption (future)**
   - Encrypt answers/documents in browser before upload.
   - Server stores ciphertext only.

2. **Encryption keys**
   - Per-user data encryption key (DEK),
   - wrapped by user secret-derived key or KMS-managed KEK.

3. **Secure backups**
   - Encrypted backups with tested restore drills,
   - key-rotation-compatible backup process.

4. **GDPR deletion and lifecycle**
   - Hard-delete workflows + deletion proof logs,
   - retention policies and configurable legal hold exceptions.

5. **Audit logs**
   - Access events, generation events, deletion events,
   - append-only integrity controls.

6. **DPIA readiness**
   - Data-flow diagrams,
   - processing activity records,
   - threat model and residual risk register.

---

## 6) Implementation Roadmap

1. **Project scaffolding**
   - Monorepo layout and base tooling.
2. **Wizard UI**
   - Multi-step responsive form, i18n, validation.
3. **Local draft persistence**
   - Anonymous save/restore in localStorage.
4. **Authentication**
   - Register/login/logout/me with cookie JWT.
5. **Database integration**
   - Prisma models, migrations, package persistence.
6. **PDF generation**
   - Build three generated PDFs from content modules.
7. **Dashboard**
   - List package history and downloadable docs.
8. **Security improvements**
   - Rate limiting, improved cookie/security headers, deletion flows.

---

## 7) Future iOS Native Integration (Documentation only)

### 7.1 Apple Health / Medical ID export concept
- Provide an iOS share/export package with core emergency preferences.
- Offer structured summary suitable for manual Medical ID entry.
- Long-term option: FHIR-compatible export layer if platform APIs permit.

### 7.2 Share sheet integration
- Native app could expose generated PDFs to iOS share sheet:
  - Mail
  - Messages
  - AirDrop
  - secure provider apps

### 7.3 Files app storage
- Save generated PDFs into app sandbox and user-selected Files location.
- Optional iCloud Drive sync through Files provider behavior.

### 7.4 QR code access
- Generate revocable QR links to emergency read-only summary.
- Expiring tokens and explicit user consent required.

---

## 8) Delivery sequence in this repository
1. This plan document (current file).
2. Scaffolding: `frontend/`, `backend/`, `docker/`, `docs/`.
3. MVP implementation aligned to sections above.
