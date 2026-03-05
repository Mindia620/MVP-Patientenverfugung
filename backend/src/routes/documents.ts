import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { z } from 'zod';

const prisma = new PrismaClient();
export const documentsRouter = Router();

documentsRouter.use(authMiddleware);

const answersSchema = z.object({
  version: z.literal('1.0'),
  personalInfo: z.object({
    fullName: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string().regex(/^\d{5}$/),
    city: z.string().min(1),
    dateOfBirth: z.string(),
    placeOfBirth: z.string().optional(),
  }),
  trustedPerson: z.object({
    fullName: z.string().min(1),
    relationship: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string().regex(/^\d{5}$/),
    city: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  }),
  trustedPerson2: z.object({
    fullName: z.string().min(1),
    relationship: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string().regex(/^\d{5}$/),
    city: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  }).optional(),
  medicalPreferences: z.object({
    cpr: z.enum(['allow', 'refuse', 'delegate']),
    ventilation: z.enum(['allow', 'refuse', 'delegate']),
    artificialNutrition: z.enum(['allow', 'refuse', 'delegate']),
    dialysis: z.enum(['allow', 'refuse', 'delegate']),
    antibiotics: z.enum(['allow', 'refuse', 'delegate']),
    painManagement: z.enum(['allow', 'refuse', 'delegate']),
  }),
  scenarios: z.object({
    terminalIllness: z.object({
      applyGeneral: z.union([z.boolean(), z.enum(['true', 'false'])]).transform((v) => v === true || v === 'true'),
      overrides: z.record(z.enum(['allow', 'refuse', 'delegate'])).optional(),
      note: z.string().optional(),
    }),
    irreversibleUnconsciousness: z.object({
      applyGeneral: z.union([z.boolean(), z.enum(['true', 'false'])]).transform((v) => v === true || v === 'true'),
      overrides: z.record(z.enum(['allow', 'refuse', 'delegate'])).optional(),
      note: z.string().optional(),
    }),
    severeDementia: z.object({
      applyGeneral: z.union([z.boolean(), z.enum(['true', 'false'])]).transform((v) => v === true || v === 'true'),
      overrides: z.record(z.enum(['allow', 'refuse', 'delegate'])).optional(),
      note: z.string().optional(),
    }),
  }),
  values: z.object({
    religiousWishes: z.string().optional(),
    otherWishes: z.string().optional(),
  }).optional(),
});

documentsRouter.post('/', async (req, res) => {
  try {
    const answers = answersSchema.parse(req.body);
    const userId = req.user!.userId;

    const pkg = await prisma.documentPackage.create({
      data: {
        userId,
        wizardVersion: '1.0',
        answers: answers as object,
      },
    });

    res.status(201).json({ documentPackage: pkg });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid answers', details: err.errors });
    }
    throw err;
  }
});

documentsRouter.get('/', async (req, res) => {
  const userId = req.user!.userId;

  const packages = await prisma.documentPackage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      wizardVersion: true,
      createdAt: true,
    },
  });

  res.json({ documentPackages: packages });
});

documentsRouter.get('/:id', async (req, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const pkg = await prisma.documentPackage.findFirst({
    where: { id, userId },
    include: { generatedDocuments: true },
  });

  if (!pkg) {
    return res.status(404).json({ error: 'Document package not found' });
  }

  res.json({ documentPackage: pkg });
});

documentsRouter.delete('/:id', async (req, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const deleted = await prisma.documentPackage.deleteMany({
    where: { id, userId },
  });

  if (deleted.count === 0) {
    return res.status(404).json({ error: 'Document package not found' });
  }

  res.json({ ok: true });
});
