import { Router } from 'express';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { generateAllDocuments } from '../services/pdfGenerator.js';
import path from 'path';
import fs from 'fs';

export const documentsRouter = Router();

documentsRouter.use(requireAuth);

documentsRouter.post('/', async (req: AuthRequest, res) => {
  try {
    const { answers } = req.body;
    if (!answers) {
      res.status(400).json({ error: 'Answers are required' });
      return;
    }

    const pkg = await prisma.documentPackage.create({
      data: {
        userId: req.userId!,
        answersJson: JSON.stringify(answers),
        status: 'DRAFT',
      },
    });

    res.status(201).json({ id: pkg.id });
  } catch (e) {
    console.error('Save documents error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

documentsRouter.get('/', async (req: AuthRequest, res) => {
  try {
    const packages = await prisma.documentPackage.findMany({
      where: { userId: req.userId! },
      include: { generatedDocuments: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ packages });
  } catch (e) {
    console.error('List documents error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

documentsRouter.get('/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const pkg = await prisma.documentPackage.findFirst({
      where: { id, userId: req.userId! },
      include: { generatedDocuments: true },
    });

    if (!pkg) {
      res.status(404).json({ error: 'Document package not found' });
      return;
    }

    res.json({ package: pkg });
  } catch (e) {
    console.error('Get document error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

documentsRouter.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const pkg = await prisma.documentPackage.findFirst({
      where: { id, userId: req.userId! },
      include: { generatedDocuments: true },
    });

    if (!pkg) {
      res.status(404).json({ error: 'Document package not found' });
      return;
    }

    for (const doc of pkg.generatedDocuments) {
      try { fs.unlinkSync(doc.filePath); } catch {}
    }

    await prisma.documentPackage.delete({ where: { id: pkg.id } });
    res.status(204).send();
  } catch (e) {
    console.error('Delete document error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

documentsRouter.post('/:id/generate', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const pkg = await prisma.documentPackage.findFirst({
      where: { id, userId: req.userId! },
    });

    if (!pkg) {
      res.status(404).json({ error: 'Document package not found' });
      return;
    }

    const answers = JSON.parse(pkg.answersJson);
    const documents = await generateAllDocuments(pkg.id, req.userId!, answers, pkg.wizardVersion);

    await prisma.documentPackage.update({
      where: { id: pkg.id },
      data: { status: 'COMPLETED' },
    });

    res.json({ documents });
  } catch (e) {
    console.error('Generate documents error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

documentsRouter.get('/:id/pdf/:type', async (req: AuthRequest, res) => {
  try {
    const packageId = req.params.id as string;
    const documentType = req.params.type as string;

    const doc = await prisma.generatedDocument.findFirst({
      where: {
        documentPackageId: packageId,
        documentType: documentType as any,
        documentPackage: { userId: req.userId! },
      },
    });

    if (!doc) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    const absolutePath = path.resolve(doc.filePath);
    if (!fs.existsSync(absolutePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`);
    const stream = fs.createReadStream(absolutePath);
    stream.pipe(res);
  } catch (e) {
    console.error('Download PDF error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});
