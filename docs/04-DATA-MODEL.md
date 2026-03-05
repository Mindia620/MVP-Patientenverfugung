# Data Model — Vorsorge Wizard

**Version:** 1.0  
**ORM:** Prisma  
**Database:** PostgreSQL 15

---

## 1. Entity Relationship Overview

```
User
 ├── WizardDraft (1:1, current in-progress answers)
 └── DocumentPackage (1:N, finalized document sets)
       └── GeneratedDocument (1:N, individual PDFs)
                └── DocumentVersion (1:N, PDF revisions)
```

---

## 2. Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────
// USER
// ─────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime? // soft delete for GDPR compliance

  draft         WizardDraft?
  packages      DocumentPackage[]
  auditLogs     AuditLog[]

  @@index([email])
}

// ─────────────────────────────────────
// WIZARD DRAFT
// Stores in-progress answers — one per user.
// Replaced on each save; not versioned.
// ─────────────────────────────────────

model WizardDraft {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Wizard schema version — used to detect stale drafts
  // when wizard questions change between releases.
  wizardVersion  String   @default("1.0")

  // JSONB columns storing answers per section.
  // Keeping them separate avoids a monolithic JSON blob
  // and allows per-section partial saves.
  personalInfo    Json?   // Step 1 answers
  trustedPerson   Json?   // Step 2 answers
  medicalPrefs    Json?   // Step 3 answers
  scenarios       Json?   // Step 4 answers
  personalValues  Json?   // Step 5 answers

  currentStep   Int      @default(1)
  completedAt   DateTime?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// ─────────────────────────────────────
// DOCUMENT PACKAGE
// A finalized set of documents generated from
// a snapshot of the wizard answers.
// Immutable after creation — new wizard runs
// create a new package (versioning).
// ─────────────────────────────────────

model DocumentPackage {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // The wizard schema version at time of generation.
  // Allows safe re-rendering of old documents.
  wizardVersion String

  // Snapshot of all answers at the time of generation.
  // Stored immutably — never overwritten.
  answersSnapshot Json

  // Package-level metadata
  label         String?   // User-editable label, e.g. "Version 2026"
  status        PackageStatus @default(PROCESSING)

  documents     GeneratedDocument[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId])
}

enum PackageStatus {
  PROCESSING    // PDF generation in progress
  COMPLETED     // All PDFs successfully generated
  FAILED        // Generation failed — retryable
}

// ─────────────────────────────────────
// GENERATED DOCUMENT
// A single PDF within a package
// (Patientenverfügung, Vorsorgevollmacht, or Betreuungsverfügung).
// ─────────────────────────────────────

model GeneratedDocument {
  id          String        @id @default(cuid())
  packageId   String
  package     DocumentPackage @relation(fields: [packageId], references: [id], onDelete: Cascade)

  type        DocumentType
  status      DocumentStatus @default(PENDING)

  // PDF stored as base64 in DB for MVP.
  // Future: replace with S3 object key.
  pdfData     Bytes?

  // File metadata
  fileSize    Int?          // bytes
  pageCount   Int?

  // For future migration to object storage:
  storageKey  String?       // S3 key or similar

  generatedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([packageId])
}

enum DocumentType {
  PATIENTENVERFUEGUNG
  VORSORGEVOLLMACHT
  BETREUUNGSVERFUEGUNG
}

enum DocumentStatus {
  PENDING
  GENERATED
  FAILED
}

// ─────────────────────────────────────
// AUDIT LOG
// Immutable log of security-relevant events.
// Required for GDPR accountability principle.
// ─────────────────────────────────────

model AuditLog {
  id          String    @id @default(cuid())
  userId      String?
  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)

  action      AuditAction
  entityType  String?   // e.g. "DocumentPackage"
  entityId    String?
  metadata    Json?     // additional context (IP hash, user agent, etc.)
  ipHash      String?   // SHA-256 hash of IP — not raw IP for privacy

  createdAt   DateTime  @default(now())

  @@index([userId])
  @@index([createdAt])
}

enum AuditAction {
  USER_REGISTER
  USER_LOGIN
  USER_LOGOUT
  USER_DELETE
  DRAFT_SAVE
  DOCUMENT_GENERATE
  DOCUMENT_DOWNLOAD
  DATA_EXPORT
}
```

---

## 3. Answer Snapshot Schema (TypeScript Types)

These types define the shape of the JSONB answer columns.

```typescript
// types/wizard-answers.ts

export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string        // ISO 8601 date string
  placeOfBirth: string
  streetAddress: string
  postalCode: string
  city: string
  country: string            // Default: "Deutschland"
}

export interface TrustedPerson {
  fullName: string
  relationship: Relationship
  streetAddress: string
  postalCode: string
  city: string
  phone?: string
  email?: string
  substitute?: {             // Ersatzbevollmächtigte/r
    fullName: string
    relationship: Relationship
    streetAddress: string
    postalCode: string
    city: string
    phone?: string
    email?: string
  }
}

export type Relationship =
  | 'spouse'
  | 'partner'
  | 'child'
  | 'sibling'
  | 'friend'
  | 'other'

export interface MedicalPreferences {
  cpr: TreatmentChoice
  ventilation: TreatmentChoice
  artificialNutrition: TreatmentChoice
  dialysis: TreatmentChoice
  antibiotics: TreatmentChoice
  painManagement: TreatmentChoice
}

export type TreatmentChoice = 'yes' | 'no' | 'doctor'

export interface Scenarios {
  terminalIllness: ScenarioChoice
  terminalIllnessNotes?: string
  irreversibleUnconscious: ScenarioChoice
  irreversibleUnconsciousNotes?: string
  severeDementia: ScenarioChoice
  severeDementiaExtra?: string
}

export type ScenarioChoice =
  | 'life_sustaining'
  | 'palliative_only'
  | 'trusted_person_decides'

export interface PersonalValues {
  valuesStatement?: string   // max 2000 chars
  spiritualWishes?: string   // max 500 chars
  specificExclusions?: string // max 500 chars
  organDonation: OrganDonationChoice
}

export type OrganDonationChoice = 'yes' | 'no' | 'already_registered'

export interface WizardAnswers {
  personalInfo?: PersonalInfo
  trustedPerson?: TrustedPerson
  medicalPreferences?: MedicalPreferences
  scenarios?: Scenarios
  personalValues?: PersonalValues
  wizardVersion: string
}
```

---

## 4. Document Versioning Strategy

### Problem
If wizard questions change in a future release (e.g., new medical scenarios added),
old documents stored in the database must still be renderable using the original
question set.

### Solution: Version-Pinned Rendering

1. Every `WizardDraft` and `DocumentPackage` stores `wizardVersion` (e.g., `"1.0"`, `"1.1"`).
2. The backend document renderer selects the correct content module based on `wizardVersion`.
3. `answersSnapshot` in `DocumentPackage` is **immutable** — stored at generation time.
4. Re-downloading an old document regenerates PDF from the frozen snapshot using
   the pinned version content module.

### Directory Convention

```
backend/src/content/
├── v1.0/
│   ├── patientenverfuegung.ts
│   ├── vorsorgevollmacht.ts
│   └── betreuungsverfuegung.ts
├── v1.1/                        # Added when wizard questions change
│   └── patientenverfuegung.ts   # Only the changed module needs updating
└── index.ts                     # Version router: getContentModule(type, version)
```

---

## 5. GDPR Data Deletion

### Soft Delete (User Account)
When a user requests deletion:
1. `User.deletedAt` is set to `now()`.
2. All `WizardDraft` rows are hard-deleted immediately.
3. All `DocumentPackage` rows are hard-deleted (cascade deletes `GeneratedDocument`).
4. A final `AuditLog` entry is created: `USER_DELETE`.
5. `User` row itself is hard-deleted after 30-day grace period.
6. During grace period: login is rejected with "account pending deletion" message.

### Data Export (Right to Access)
```typescript
// Returns all user data as structured JSON
GET /api/users/me/export
→ {
    user: { id, email, createdAt },
    draft: { ... answers },
    documents: [
      {
        id, createdAt, type,
        answers: { ... snapshot }
      }
    ]
  }
```
