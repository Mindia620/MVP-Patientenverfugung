# Vorsorge Wizard — Data Model (Prisma)

**Version:** 1.0  
**Date:** March 2025

---

## 1. Design Principles

- **Document versioning:** Wizard schema version stored with each package so future changes don't break old documents
- **Flexible answers:** JSONB for answers to support schema evolution
- **Audit trail:** `createdAt`, `updatedAt` on all models
- **Soft delete:** Optional for future (not in MVP)

---

## 2. Entity Relationship Diagram

```
┌──────────────┐       ┌─────────────────────┐       ┌──────────────────────┐
│    User      │       │   DocumentPackage    │       │  GeneratedDocument   │
├──────────────┤       ├─────────────────────┤       ├──────────────────────┤
│ id           │───┐   │ id                  │   ┌───│ id                   │
│ email        │   │   │ userId              │───┘   │ documentPackageId    │
│ passwordHash │   └──▶│ wizardVersion       │       │ documentType         │
│ createdAt    │       │ answersId           │───┐   │ filePath / blob      │
│ updatedAt    │       │ createdAt           │   │   │ createdAt            │
└──────────────┘       │ updatedAt           │   │   └──────────────────────┘
                       └─────────────────────┘   │
                              │                  │
                              │                  │
                              ▼                  │
                       ┌─────────────────────┐   │
                       │      Answers        │   │
                       ├─────────────────────┤   │
                       │ id                  │◀──┘
                       │ data (JSON)         │
                       │ createdAt           │
                       │ updatedAt           │
                       └─────────────────────┘
```

---

## 3. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  documentPackages DocumentPackage[]
}

model Answers {
  id        String   @id @default(uuid())
  data      Json     // Wizard answers - schema defined by wizardVersion
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  documentPackages DocumentPackage[]
}

model DocumentPackage {
  id            String   @id @default(uuid())
  userId        String
  wizardVersion String   // e.g. "1.0" - links to answer schema
  answersId     String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers           Answers            @relation(fields: [answersId], references: [id], onDelete: Cascade)
  generatedDocuments GeneratedDocument[]

  @@index([userId])
  @@index([createdAt])
}

model GeneratedDocument {
  id                String   @id @default(uuid())
  documentPackageId String
  documentType      String   // "patientenverfuegung" | "vorsorgevollmacht" | "betreuungsverfuegung"
  // Option A: Store file path (if saving to disk)
  filePath          String?
  // Option B: Store in DB (simpler for MVP, smaller docs)
  content           Bytes?
  createdAt         DateTime @default(now())

  documentPackage DocumentPackage @relation(fields: [documentPackageId], references: [id], onDelete: Cascade)

  @@unique([documentPackageId, documentType])
  @@index([documentPackageId])
}
```

---

## 4. Answers JSON Schema (wizardVersion 1.0)

The `Answers.data` field stores a JSON object with the following structure. This schema is versioned; when the wizard changes, increment `wizardVersion` and support both old and new schemas in document generation.

```typescript
interface WizardAnswersV1 {
  // Step 1 - Personal Information
  personalInfo: {
    fullName: string;
    dateOfBirth: string;      // ISO date
    placeOfBirth: string;
    address: {
      street: string;
      postalCode: string;
      city: string;
    };
  };

  // Step 2 - Trusted Person
  trustedPerson: {
    fullName: string;
    relationship: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  alternatePerson?: {
    fullName: string;
    relationship: string;
    phone?: string;
    email?: string;
    address?: string;
  };

  // Step 3 - Medical Treatment Preferences
  medicalPreferences: {
    cpr: "yes" | "no" | "situation_dependent";
    ventilation: "yes" | "no" | "situation_dependent";
    artificialNutrition: "yes" | "no" | "situation_dependent";
    dialysis: "yes" | "no" | "situation_dependent";
    antibiotics: "yes" | "no" | "situation_dependent";
    painManagement: "yes" | "no" | "situation_dependent";
  };

  // Step 4 - Situational Scenarios
  scenarios: {
    terminalIllness: "same" | { /* overrides */ };
    irreversibleUnconsciousness: "same" | { /* overrides */ };
    severeDementia: "same" | { /* overrides */ };
  };

  // Step 5 - Optional
  additionalWishes?: string;
}
```

---

## 5. Document Versioning Strategy

| Scenario | Approach |
|----------|----------|
| **New wizard fields** | Add optional fields to schema; old documents omit them. Document generator checks for presence. |
| **Breaking change** | Bump `wizardVersion` to "1.1". Document generator has `render(answers, version)` and branches by version. |
| **PDF template change** | Regenerate PDFs on demand; store `GeneratedDocument` with new content. Optionally version document templates. |

---

## 6. Indexes

- `DocumentPackage.userId` — list packages by user
- `DocumentPackage.createdAt` — sort by date
- `GeneratedDocument.documentPackageId` — fetch PDFs for a package
- `User.email` — unique, used for login lookup

---

## 7. Migrations

- Use `prisma migrate dev` for development
- Migrations stored in `prisma/migrations/`
- Production: `prisma migrate deploy`
