import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { logAudit } from '../lib/audit'
import { getDocumentContent } from '../content'
import { generatePdf } from '../services/pdf.service'
import { WizardAnswers } from '../types/wizard'
import { DocumentType } from '@prisma/client'

const router = Router()

const GenerateSchema = z.object({
  wizardVersion: z.string().default('1.0'),
  personalInfo: z.unknown().optional(),
  trustedPerson: z.unknown().optional(),
  medicalPrefs: z.unknown().optional(),
  scenarios: z.unknown().optional(),
  personalValues: z.unknown().optional(),
  label: z.string().optional(),
})

router.post(
  '/generate',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = GenerateSchema.parse(req.body)

      const answersSnapshot: WizardAnswers = {
        wizardVersion: body.wizardVersion,
        personalInfo: body.personalInfo as WizardAnswers['personalInfo'],
        trustedPerson: body.trustedPerson as WizardAnswers['trustedPerson'],
        medicalPrefs: body.medicalPrefs as WizardAnswers['medicalPrefs'],
        scenarios: body.scenarios as WizardAnswers['scenarios'],
        personalValues: body.personalValues as WizardAnswers['personalValues'],
      }

      const pkg = await prisma.documentPackage.create({
        data: {
          userId: req.user!.userId,
          wizardVersion: body.wizardVersion,
          answersSnapshot: answersSnapshot as object,
          label: body.label,
          status: 'PROCESSING',
          documents: {
            create: [
              { type: 'PATIENTENVERFUEGUNG', status: 'PENDING' },
              { type: 'VORSORGEVOLLMACHT', status: 'PENDING' },
              { type: 'BETREUUNGSVERFUEGUNG', status: 'PENDING' },
            ],
          },
        },
        include: { documents: true },
      })

      await logAudit({
        action: 'DOCUMENT_GENERATE',
        userId: req.user!.userId,
        entityType: 'DocumentPackage',
        entityId: pkg.id,
        req,
      })

      const documentTypes: DocumentType[] = [
        'PATIENTENVERFUEGUNG',
        'VORSORGEVOLLMACHT',
        'BETREUUNGSVERFUEGUNG',
      ]

      let allSucceeded = true

      for (const docType of documentTypes) {
        const doc = pkg.documents.find((d) => d.type === docType)
        if (!doc) continue

        try {
          const html = getDocumentContent(docType, body.wizardVersion, answersSnapshot)
          const pdfBuffer = await generatePdf(html)

          await prisma.generatedDocument.update({
            where: { id: doc.id },
            data: {
              status: 'GENERATED',
              pdfData: new Uint8Array(pdfBuffer),
              fileSize: pdfBuffer.length,
              generatedAt: new Date(),
            },
          })
        } catch (err) {
          console.error(`[pdf] Failed to generate ${docType}:`, err)
          await prisma.generatedDocument.update({
            where: { id: doc.id },
            data: { status: 'FAILED' },
          })
          allSucceeded = false
        }
      }

      await prisma.documentPackage.update({
        where: { id: pkg.id },
        data: { status: allSucceeded ? 'COMPLETED' : 'FAILED' },
      })

      const updatedPkg = await prisma.documentPackage.findUnique({
        where: { id: pkg.id },
        include: {
          documents: {
            select: {
              id: true,
              type: true,
              status: true,
              fileSize: true,
              generatedAt: true,
            },
          },
        },
      })

      res.status(201).json({ package: updatedPkg })
    } catch (err) {
      next(err)
    }
  }
)

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const packages = await prisma.documentPackage.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        documents: {
          select: {
            id: true,
            type: true,
            status: true,
            fileSize: true,
            generatedAt: true,
          },
        },
      },
    })
    res.json({ packages })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string
    const pkg = await prisma.documentPackage.findFirst({
      where: { id, userId: req.user!.userId },
      include: {
        documents: {
          select: {
            id: true,
            type: true,
            status: true,
            fileSize: true,
            generatedAt: true,
          },
        },
      },
    })

    if (!pkg) {
      res.status(404).json({ error: 'Document package not found' })
      return
    }

    res.json({ package: pkg })
  } catch (err) {
    next(err)
  }
})

router.get(
  '/:id/pdf/:type',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const typeParam = (req.params.type as string).toLowerCase()
      const packageId = req.params.id as string

      const typeMap: Record<string, DocumentType> = {
        patientenverfuegung: 'PATIENTENVERFUEGUNG',
        vorsorgevollmacht: 'VORSORGEVOLLMACHT',
        betreuungsverfuegung: 'BETREUUNGSVERFUEGUNG',
      }

      const docType = typeMap[typeParam]
      if (!docType) {
        res.status(400).json({ error: 'Invalid document type' })
        return
      }

      const doc = await prisma.generatedDocument.findFirst({
        where: {
          type: docType,
          package: { id: packageId, userId: req.user!.userId },
        },
      })

      if (!doc || !doc.pdfData) {
        res.status(404).json({ error: 'Document not found or not yet generated' })
        return
      }

      await logAudit({
        action: 'DOCUMENT_DOWNLOAD',
        userId: req.user!.userId,
        entityType: 'GeneratedDocument',
        entityId: doc.id,
        req,
      })

      const filename = `${typeParam}_${new Date().toISOString().split('T')[0]}.pdf`
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      res.setHeader('Content-Length', doc.pdfData.length)
      res.send(Buffer.from(doc.pdfData))
    } catch (err) {
      next(err)
    }
  }
)

export default router
