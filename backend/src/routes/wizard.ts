import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { logAudit } from '../lib/audit'
import { Prisma } from '@prisma/client'

const router = Router()

const DraftSchema = z.object({
  wizardVersion: z.string().default('1.0'),
  personalInfo: z.unknown().optional(),
  trustedPerson: z.unknown().optional(),
  medicalPrefs: z.unknown().optional(),
  scenarios: z.unknown().optional(),
  personalValues: z.unknown().optional(),
  currentStep: z.number().int().min(1).max(8).default(1),
})

router.get('/draft', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const draft = await prisma.wizardDraft.findUnique({
      where: { userId: req.user!.userId },
    })
    res.json({ draft })
  } catch (err) {
    next(err)
  }
})

router.post('/draft', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = DraftSchema.parse(req.body)

    const jsonOrNull = (val: unknown): Prisma.InputJsonValue | Prisma.NullTypes.JsonNull => {
      if (val === null || val === undefined) return Prisma.JsonNull
      return val as Prisma.InputJsonValue
    }

    const createData = {
      userId: req.user!.userId,
      wizardVersion: data.wizardVersion,
      currentStep: data.currentStep,
      personalInfo: jsonOrNull(data.personalInfo),
      trustedPerson: jsonOrNull(data.trustedPerson),
      medicalPrefs: jsonOrNull(data.medicalPrefs),
      scenarios: jsonOrNull(data.scenarios),
      personalValues: jsonOrNull(data.personalValues),
    }

    const draft = await prisma.wizardDraft.upsert({
      where: { userId: req.user!.userId },
      create: createData,
      update: {
        wizardVersion: data.wizardVersion,
        currentStep: data.currentStep,
        personalInfo: jsonOrNull(data.personalInfo),
        trustedPerson: jsonOrNull(data.trustedPerson),
        medicalPrefs: jsonOrNull(data.medicalPrefs),
        scenarios: jsonOrNull(data.scenarios),
        personalValues: jsonOrNull(data.personalValues),
      },
    })

    await logAudit({
      action: 'DRAFT_SAVE',
      userId: req.user!.userId,
      metadata: { currentStep: String(data.currentStep), wizardVersion: data.wizardVersion },
      req,
    })

    res.json({ draft })
  } catch (err) {
    next(err)
  }
})

export default router
