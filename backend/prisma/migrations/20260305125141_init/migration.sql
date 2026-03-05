-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PATIENTENVERFUEGUNG', 'VORSORGEVOLLMACHT', 'BETREUUNGSVERFUEGUNG');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'GENERATED', 'FAILED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_REGISTER', 'USER_LOGIN', 'USER_LOGOUT', 'USER_DELETE', 'DRAFT_SAVE', 'DOCUMENT_GENERATE', 'DOCUMENT_DOWNLOAD', 'DATA_EXPORT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WizardDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wizardVersion" TEXT NOT NULL DEFAULT '1.0',
    "personalInfo" JSONB,
    "trustedPerson" JSONB,
    "medicalPrefs" JSONB,
    "scenarios" JSONB,
    "personalValues" JSONB,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WizardDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentPackage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wizardVersion" TEXT NOT NULL,
    "answersSnapshot" JSONB NOT NULL,
    "label" TEXT,
    "status" "PackageStatus" NOT NULL DEFAULT 'PROCESSING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedDocument" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "pdfData" BYTEA,
    "fileSize" INTEGER,
    "pageCount" INTEGER,
    "storageKey" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WizardDraft_userId_key" ON "WizardDraft"("userId");

-- CreateIndex
CREATE INDEX "DocumentPackage_userId_idx" ON "DocumentPackage"("userId");

-- CreateIndex
CREATE INDEX "GeneratedDocument_packageId_idx" ON "GeneratedDocument"("packageId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "WizardDraft" ADD CONSTRAINT "WizardDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentPackage" ADD CONSTRAINT "DocumentPackage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedDocument" ADD CONSTRAINT "GeneratedDocument_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "DocumentPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
