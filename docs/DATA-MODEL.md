# Vorsorge Wizard — Data Model

**Version:** 1.0  
**Date:** March 2025

---

## 1. Design Principles

- **Document versioning** — Wizard schema changes must not break old documents
- **JSON for answers** — Flexible structure; version field for migration
- **Audit trail** — Created/updated timestamps

---

## 2. Entity Relationship Diagram

```
┌──────────────┐       ┌─────────────────────┐       ┌──────────────────────┐
│    User      │       │   DocumentPackage    │       │   GeneratedDocument  │
├──────────────┤       ├─────────────────────┤       ├──────────────────────┤
│ id           │───┐   │ id                  │───┐   │ id                   │
│ email        │   │   │ userId              │   │   │ documentPackageId    │
│ passwordHash │   └──>│ wizardVersion       │   └──>│ documentType         │
│ createdAt    │       │ createdAt           │       │ filePath / blob      │
│ updatedAt    │       │ updatedAt           │       │ createdAt            │
└──────────────┘       └─────────────────────┘       └──────────────────────┘
                                │
                                │ 1:1 (embedded or separate)
                                ▼
                       ┌─────────────────────┐
                       │      Answers        │
                       ├─────────────────────┤
                       │ (JSON in Document   │
                       │  Package or separate│
                       │  table)             │
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
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  documentPackages DocumentPackage[]
}

model DocumentPackage {
  id            String   @id @default(cuid())
  userId        String
  wizardVersion String   // e.g. "1.0" — for future migrations
  answers       Json     // Full wizard answers
  createdAt     DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user               User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  generatedDocuments GeneratedDocument[]

  @@index([userId])
}

model GeneratedDocument {
  id                String   @id @default(cuid())
  documentPackageId String
  documentType      String   // "patientenverfuegung" | "vorsorgevollmacht" | "betreuungsverfuegung"
  filePath          String?  // If stored on disk
  // Alternatively: store as blob in DB for simplicity in MVP
  createdAt         DateTime @default(now())

  documentPackage DocumentPackage @relation(fields: [documentPackageId], references: [id], onDelete: Cascade)

  @@unique([documentPackageId, documentType])
  @@index([documentPackageId])
}
```

---

## 4. Answers JSON Schema (Version 1.0)

```typescript
interface AnswersV1 {
  version: "1.0";
  personalInfo: {
    fullName: string;
    street: string;
    postalCode: string;
    city: string;
    dateOfBirth: string; // ISO date
    placeOfBirth?: string;
  };
  trustedPerson: {
    fullName: string;
    relationship: string;
    street: string;
    postalCode: string;
    city: string;
    phone?: string;
    email?: string;
  };
  trustedPerson2?: {
    fullName: string;
    relationship: string;
    street: string;
    postalCode: string;
    city: string;
    phone?: string;
    email?: string;
  };
  medicalPreferences: {
    cpr: "allow" | "refuse" | "delegate";
    ventilation: "allow" | "refuse" | "delegate";
    artificialNutrition: "allow" | "refuse" | "delegate";
    dialysis: "allow" | "refuse" | "delegate";
    antibiotics: "allow" | "refuse" | "delegate";
    painManagement: "allow" | "refuse" | "delegate";
  };
  scenarios: {
    terminalIllness: {
      applyGeneral: boolean;
      overrides?: Partial<AnswersV1["medicalPreferences"]>;
      note?: string;
    };
    irreversibleUnconsciousness: {
      applyGeneral: boolean;
      overrides?: Partial<AnswersV1["medicalPreferences"]>;
      note?: string;
    };
    severeDementia: {
      applyGeneral: boolean;
      overrides?: Partial<AnswersV1["medicalPreferences"]>;
      note?: string;
    };
  };
  values?: {
    religiousWishes?: string;
    otherWishes?: string;
  };
}
```

---

## 5. Document Versioning Strategy

When the wizard changes (new fields, different structure):

1. **Bump `wizardVersion`** (e.g. "1.1")
2. **Add migration for `Answers`** — New schema with `version: "1.1"`
3. **Compose functions** — Check `answers.version` and use appropriate composer
4. **Old documents** — Always use stored `answers` as-is; composer handles version

```typescript
function composeDocument(answers: Answers): string {
  switch (answers.version) {
    case "1.0":
      return composeV1(answers);
    case "1.1":
      return composeV1_1(answers);
    default:
      return composeV1(answers); // Fallback
  }
}
```

---

## 6. Indexes

- `User.email` — Unique, for login lookup
- `DocumentPackage.userId` — List user's packages
- `GeneratedDocument.documentPackageId` — Fetch PDFs for package
