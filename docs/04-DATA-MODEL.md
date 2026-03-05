# Vorsorge Wizard — Data Model

**Version:** 1.0
**Date:** 2026-03-05

---

## 1. Entity Relationship Overview

```
User (1) ──── (N) DocumentPackage (1) ──── (1) Answers
                         │
                         └──── (N) GeneratedDocument
```

---

## 2. Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id               String            @id @default(uuid())
  email            String            @unique
  passwordHash     String
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  deletedAt        DateTime?
  documentPackages DocumentPackage[]
}

model DocumentPackage {
  id                 String              @id @default(uuid())
  userId             String
  user               User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  wizardVersion      String              @default("1.0")
  status             PackageStatus       @default(DRAFT)
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  answers            Answers?
  generatedDocuments GeneratedDocument[]

  @@index([userId])
}

model Answers {
  id                String          @id @default(uuid())
  documentPackageId String          @unique
  documentPackage   DocumentPackage @relation(fields: [documentPackageId], references: [id], onDelete: Cascade)

  // Step 1: Personal Information
  salutation        String
  firstName         String
  lastName          String
  dateOfBirth       DateTime
  placeOfBirth      String
  street            String
  postalCode        String
  city              String
  phone             String?

  // Step 2: Trusted Person
  trustedPersonSalutation   String
  trustedPersonFirstName    String
  trustedPersonLastName     String
  trustedPersonDateOfBirth  DateTime
  trustedPersonRelationship String
  trustedPersonStreet       String
  trustedPersonPostalCode   String
  trustedPersonCity         String
  trustedPersonPhone        String

  // Step 2b: Alternate Trusted Person (optional)
  hasAlternatePerson           Boolean  @default(false)
  alternatePersonSalutation    String?
  alternatePersonFirstName     String?
  alternatePersonLastName      String?
  alternatePersonDateOfBirth   DateTime?
  alternatePersonRelationship  String?
  alternatePersonStreet        String?
  alternatePersonPostalCode    String?
  alternatePersonCity          String?
  alternatePersonPhone         String?

  // Step 3: Medical Treatment Preferences
  cprPreference              TreatmentPreference
  ventilationPreference      TreatmentPreference
  artificialNutritionPreference TreatmentPreference
  dialysisPreference         TreatmentPreference
  antibioticsPreference      TreatmentPreference
  painManagementPreference   TreatmentPreference

  // Step 4: Situational Scenarios
  terminalIllness            Boolean  @default(false)
  irreversibleUnconsciousness Boolean @default(false)
  severeDementia             Boolean  @default(false)

  // Step 5: Values & Wishes (optional)
  personalValues             String?
  religiousWishes            String?
  organDonation              OrganDonationPreference?
  burialWishes               String?

  createdAt                  DateTime @default(now())
  updatedAt                  DateTime @updatedAt
}

model GeneratedDocument {
  id                String          @id @default(uuid())
  documentPackageId String
  documentPackage   DocumentPackage @relation(fields: [documentPackageId], references: [id], onDelete: Cascade)
  documentType      DocumentType
  fileName          String
  filePath          String
  fileSize          Int
  generatedAt       DateTime        @default(now())
  wizardVersion     String

  @@index([documentPackageId])
}

enum PackageStatus {
  DRAFT
  COMPLETED
  ARCHIVED
}

enum TreatmentPreference {
  YES
  NO
  DOCTOR_DECIDES
}

enum OrganDonationPreference {
  YES
  NO
  RESTRICTED
}

enum DocumentType {
  PATIENTENVERFUEGUNG
  VORSORGEVOLLMACHT
  BETREUUNGSVERFUEGUNG
}
```

---

## 3. Design Decisions

### 3.1 Versioning Strategy
The `wizardVersion` field on both `DocumentPackage` and `GeneratedDocument` ensures that:
- Future wizard changes (new questions, changed options) do not invalidate old documents
- Documents can be re-generated with the correct template version
- Content modules are versioned and selected based on this field

### 3.2 Soft Delete
`User.deletedAt` enables GDPR-compliant deletion:
- Soft delete preserves audit trail temporarily
- Hard delete scheduled after retention period
- Cascade deletion for all user data

### 3.3 Answers as Flat Table
Instead of a JSON blob, answers are stored as typed columns:
- Enables database-level validation
- Supports future querying and analytics (anonymized)
- Migration path for schema changes via Prisma migrations
- Trade-off: new questions require migrations (acceptable for MVP)

### 3.4 File Storage
`GeneratedDocument.filePath` stores the relative path to the generated PDF:
- MVP: local filesystem (`./storage/pdfs/{userId}/{docId}.pdf`)
- Production: S3-compatible object storage
- Files are never served directly — always through authenticated API endpoint

---

## 4. Indexes & Performance

- `User.email` — unique index for login lookups
- `DocumentPackage.userId` — index for user's document list
- `GeneratedDocument.documentPackageId` — index for package's documents
- `Answers.documentPackageId` — unique index (1:1 relationship)

---

## 5. Migration Strategy

1. Initial migration creates all tables
2. Future wizard changes:
   - Add nullable columns to Answers for new fields
   - Bump wizardVersion default
   - Content modules handle missing fields gracefully
3. Breaking changes:
   - New Answers table version (e.g., AnswersV2)
   - Old packages retain old answers table reference
