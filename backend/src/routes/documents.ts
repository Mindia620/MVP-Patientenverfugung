import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const saveSchema = z.object({
  wizardVersion: z.string(),
  answers: z.record(z.unknown()),
});

export const documentRoutes = Router();

documentRoutes.use(authMiddleware);

documentRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { sub: string } }).user;
    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const parsed = saveSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid request body' });
      return;
    }

    const { wizardVersion, answers } = parsed.data;

    const answersRecord = await prisma.answers.create({
      data: { data: answers as object },
    });

    const pkg = await prisma.documentPackage.create({
      data: {
        userId: user.sub,
        wizardVersion,
        answersId: answersRecord.id,
      },
    });

    res.json({ id: pkg.id, createdAt: pkg.createdAt });
  } catch (err) {
    console.error('Save document error:', err);
    res.status(500).json({ message: 'Failed to save document' });
  }
});

documentRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { sub: string } }).user;
    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const packages = await prisma.documentPackage.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, wizardVersion: true },
    });

    res.json({ packages });
  } catch (err) {
    console.error('List documents error:', err);
    res.status(500).json({ message: 'Failed to list documents' });
  }
});

documentRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { sub: string } }).user;
    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const pkg = await prisma.documentPackage.findFirst({
      where: { id: req.params.id, userId: user.sub },
      include: { answers: true },
    });

    if (!pkg) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    res.json({ id: pkg.id, answers: pkg.answers.data, createdAt: pkg.createdAt });
  } catch (err) {
    console.error('Get document error:', err);
    res.status(500).json({ message: 'Failed to get document' });
  }
});

documentRoutes.get('/:id/pdf/:type', async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { sub: string } }).user;
    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { type } = req.params;
    const validTypes = ['patientenverfuegung', 'vorsorgevollmacht', 'betreuungsverfuegung'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ message: 'Invalid document type' });
      return;
    }

    const pkg = await prisma.documentPackage.findFirst({
      where: { id: req.params.id, userId: user.sub },
      include: { answers: true },
    });

    if (!pkg) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    const { generatePdf } = await import('../services/pdf.service.js');
    const pdfBuffer = await generatePdf(type, pkg.answers.data as object);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ message: 'PDF generation failed' });
  }
});

documentRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { sub: string } }).user;
    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const pkg = await prisma.documentPackage.findFirst({
      where: { id: req.params.id, userId: user.sub },
    });

    if (!pkg) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    await prisma.documentPackage.delete({ where: { id: pkg.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});
