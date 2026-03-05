import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { createPackageSchema, wizardAnswersSchema } from "../schemas/wizard.js";
import { assembleGermanDocuments } from "../services/documentAssembly.js";
import { renderPdfFromText } from "../services/pdf.js";

export const packagesRouter = Router();

packagesRouter.use(requireAuth);

packagesRouter.get("/", async (req, res) => {
  const packages = await prisma.documentPackage.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
    include: {
      generatedDocuments: {
        select: {
          id: true,
          type: true,
          fileName: true,
          createdAt: true,
        },
      },
    },
  });

  return res.json({ packages });
});

packagesRouter.post("/", async (req, res) => {
  const parsed = createPackageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid package payload." });
  }

  const { locale, answers } = parsed.data;

  const created = await prisma.documentPackage.create({
    data: {
      userId: req.userId!,
      locale,
      wizardSchemaVersion: config.wizardSchemaVersion,
      contentTemplateVersion: config.contentTemplateVersion,
      answersSnapshots: {
        create: {
          schemaVersion: config.wizardSchemaVersion,
          data: answers as unknown as Prisma.InputJsonValue,
        },
      },
    },
    include: {
      answersSnapshots: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return res.status(201).json({ package: created });
});

packagesRouter.post("/:packageId/generate", async (req, res) => {
  const packageId = req.params.packageId;

  const packageItem = await prisma.documentPackage.findFirst({
    where: { id: packageId, userId: req.userId },
    include: {
      answersSnapshots: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      generatedDocuments: true,
    },
  });

  if (!packageItem) {
    return res.status(404).json({ message: "Package not found." });
  }

  const latestAnswers = packageItem.answersSnapshots[0];
  if (!latestAnswers) {
    return res.status(400).json({ message: "No answers found for package." });
  }

  const validatedAnswers = wizardAnswersSchema.safeParse(latestAnswers.data);
  if (!validatedAnswers.success) {
    return res.status(400).json({ message: "Stored answers are invalid for this schema version." });
  }

  const assembled = assembleGermanDocuments(validatedAnswers.data);

  const existingCountByType = packageItem.generatedDocuments.reduce<Record<string, number>>((acc, doc) => {
    acc[doc.type] = (acc[doc.type] ?? 0) + 1;
    return acc;
  }, {});

  const createdDocuments = [];

  for (const item of assembled) {
    const rendered = await renderPdfFromText(item.title, item.content);
    const version = (existingCountByType[item.type] ?? 0) + 1;

    const document = await prisma.generatedDocument.create({
      data: {
        packageId: packageItem.id,
        type: item.type,
        version,
        fileName: item.fileName,
        mimeType: "application/pdf",
        pdfData: Buffer.from(rendered.bytes),
        contentHash: rendered.contentHash,
      },
      select: {
        id: true,
        type: true,
        fileName: true,
        version: true,
        createdAt: true,
      },
    });

    createdDocuments.push(document);
  }

  await prisma.documentPackage.update({
    where: { id: packageItem.id },
    data: { status: "GENERATED" },
  });

  return res.status(201).json({ documents: createdDocuments });
});

packagesRouter.get("/:packageId/documents/:documentId/download", async (req, res) => {
  const packageId = req.params.packageId;
  const documentId = req.params.documentId;

  const doc = await prisma.generatedDocument.findFirst({
    where: {
      id: documentId,
      packageId,
      package: {
        userId: req.userId,
      },
    },
  });

  if (!doc) {
    return res.status(404).json({ message: "Document not found." });
  }

  const safeName = z.string().parse(doc.fileName).replace(/[^a-zA-Z0-9._-]/g, "_");

  res.setHeader("Content-Type", doc.mimeType);
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
  return res.send(Buffer.from(doc.pdfData));
});
