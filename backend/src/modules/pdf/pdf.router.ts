import { Router } from 'express'
import type { Response } from 'express'
import { requireAuth, type AuthRequest } from '../../middleware/auth.js'
import { pdfLimiter } from '../../middleware/rateLimiter.js'
import { prisma } from '../../prisma/client.js'
import { pdfService } from './pdf.service.js'

const router = Router()
router.use(requireAuth)

const DOC_BUILDERS = {
  patientenverfuegung: 'buildPatientenverfuegung',
  vorsorgevollmacht: 'buildVorsorgevollmacht',
  betreuungsverfuegung: 'buildBetreuungsverfuegung',
} as const

type DocType = keyof typeof DOC_BUILDERS

router.post('/:packageId/all', pdfLimiter, async (req: AuthRequest, res: Response) => {
  const { packageId } = req.params

  try {
    const pkg = await prisma.documentPackage.findFirst({
      where: { id: packageId, userId: req.userId },
      include: { answers: true },
    })

    if (!pkg || !pkg.answers) {
      res.status(404).json({ error: 'Paket nicht gefunden.' })
      return
    }

    const answers = pkg.answers.data as Parameters<typeof pdfService.buildPatientenverfuegung>[0]

    const docTypes: DocType[] = ['patientenverfuegung', 'vorsorgevollmacht', 'betreuungsverfuegung']
    const documents = []

    for (const docType of docTypes) {
      const builderName = DOC_BUILDERS[docType]
      const html = pdfService[builderName](answers)
      const pdfBytes = await pdfService.generatePdf(html)

      const fileName = `${docType}_${new Date().toISOString().slice(0, 10)}.pdf`

      const existing = await prisma.generatedDocument.findFirst({
        where: { packageId, documentType: docType },
        orderBy: { version: 'desc' },
      })
      const nextVersion = existing ? existing.version + 1 : 1

      const doc = await prisma.generatedDocument.create({
        data: {
          packageId,
          documentType: docType,
          version: nextVersion,
          fileName,
          content: pdfBytes,
        },
      })

      documents.push({
        id: doc.id,
        documentType: doc.documentType,
        version: doc.version,
        fileName: doc.fileName,
        createdAt: doc.createdAt,
      })
    }

    res.json({ documents })
  } catch (err) {
    console.error('PDF generation error:', err)
    res.status(500).json({ error: 'PDF-Generierung fehlgeschlagen.' })
  }
})

router.get('/:packageId/status', async (req: AuthRequest, res: Response) => {
  const { packageId } = req.params

  try {
    const pkg = await prisma.documentPackage.findFirst({
      where: { id: packageId, userId: req.userId },
    })
    if (!pkg) {
      res.status(404).json({ error: 'Nicht gefunden.' })
      return
    }

    const docs = await prisma.generatedDocument.findMany({
      where: { packageId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        documentType: true,
        version: true,
        fileName: true,
        createdAt: true,
      },
    })

    res.json({ documents: docs })
  } catch {
    res.status(500).json({ error: 'Serverfehler.' })
  }
})

router.get('/:packageId/download/:docId', async (req: AuthRequest, res: Response) => {
  const { packageId, docId } = req.params

  try {
    const pkg = await prisma.documentPackage.findFirst({
      where: { id: packageId, userId: req.userId },
    })
    if (!pkg) {
      res.status(404).json({ error: 'Nicht gefunden.' })
      return
    }

    const doc = await prisma.generatedDocument.findFirst({
      where: { id: docId, packageId },
    })
    if (!doc) {
      res.status(404).json({ error: 'Dokument nicht gefunden.' })
      return
    }

    const pdfBuffer = Buffer.isBuffer(doc.content) ? doc.content : Buffer.from(doc.content)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`)
    res.setHeader('Content-Length', pdfBuffer.length)
    res.end(pdfBuffer)
  } catch {
    res.status(500).json({ error: 'Download fehlgeschlagen.' })
  }
})

export { router as pdfRouter }
