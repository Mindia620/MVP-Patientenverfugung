import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { logAudit } from '../lib/audit'

const router = Router()

const DeleteAccountSchema = z.object({
  password: z.string().min(1),
})

router.get('/me/export', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, createdAt: true },
    })

    const draft = await prisma.wizardDraft.findUnique({
      where: { userId: req.user!.userId },
    })

    const packages = await prisma.documentPackage.findMany({
      where: { userId: req.user!.userId },
      include: {
        documents: {
          select: { id: true, type: true, status: true, generatedAt: true, fileSize: true },
        },
      },
    })

    await logAudit({ action: 'DATA_EXPORT', userId: req.user!.userId, req })

    res.json({
      exportedAt: new Date().toISOString(),
      user,
      draft: draft
        ? {
            wizardVersion: draft.wizardVersion,
            currentStep: draft.currentStep,
            personalInfo: draft.personalInfo,
            trustedPerson: draft.trustedPerson,
            medicalPrefs: draft.medicalPrefs,
            scenarios: draft.scenarios,
            personalValues: draft.personalValues,
          }
        : null,
      documentPackages: packages.map((p) => ({
        id: p.id,
        label: p.label,
        status: p.status,
        createdAt: p.createdAt,
        wizardVersion: p.wizardVersion,
        answers: p.answersSnapshot,
        documents: p.documents,
      })),
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = DeleteAccountSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Incorrect password' })
      return
    }

    // Hard delete all user data immediately
    await prisma.wizardDraft.deleteMany({ where: { userId: user.id } })
    await prisma.documentPackage.deleteMany({ where: { userId: user.id } })

    await logAudit({ action: 'USER_DELETE', userId: user.id, req })

    // Soft delete user (hard delete after 30 days via cron in production)
    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: new Date() },
    })

    res.clearCookie('token', { path: '/' })
    res.json({ message: 'Account deleted successfully' })
  } catch (err) {
    next(err)
  }
})

export default router
