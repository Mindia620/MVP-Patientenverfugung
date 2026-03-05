import { Router } from 'express';
import { z } from 'zod';
import { generateDocument } from '../pdf/generator.js';

export const pdfRouter = Router();

const answersSchema = z.object({
  version: z.literal('1.0'),
  personalInfo: z.object({
    fullName: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string(),
    city: z.string().min(1),
    dateOfBirth: z.string(),
    placeOfBirth: z.string().optional(),
  }),
  trustedPerson: z.object({
    fullName: z.string().min(1),
    relationship: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string(),
    city: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  trustedPerson2: z.object({
    fullName: z.string().min(1),
    relationship: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string(),
    city: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().optional(),
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
      applyGeneral: z.boolean(),
      overrides: z.record(z.enum(['allow', 'refuse', 'delegate'])).optional(),
      note: z.string().optional(),
    }),
    irreversibleUnconsciousness: z.object({
      applyGeneral: z.boolean(),
      overrides: z.record(z.enum(['allow', 'refuse', 'delegate'])).optional(),
      note: z.string().optional(),
    }),
    severeDementia: z.object({
      applyGeneral: z.boolean(),
      overrides: z.record(z.enum(['allow', 'refuse', 'delegate'])).optional(),
      note: z.string().optional(),
    }),
  }),
  values: z.object({
    religiousWishes: z.string().optional(),
    otherWishes: z.string().optional(),
  }).optional(),
});

pdfRouter.post('/generate', async (req, res) => {
  try {
    const body = req.body;
    const docType = body.documentType as string;

    if (!['patientenverfuegung', 'vorsorgevollmacht', 'betreuungsverfuegung'].includes(docType)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const answers = answersSchema.parse(body.answers);

    const pdfBuffer = await generateDocument(docType as import('../pdf/generator.js').DocumentType, answers);

    const filename = `${docType}_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid answers', details: err.errors });
    }
    throw err;
  }
});
