import { Router } from 'express'
import type { Response } from 'express'
import { requireAuth, type AuthRequest } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { createPackageSchema } from './documents.schema.js'
import { documentsService } from './documents.service.js'

const router = Router()

router.use(requireAuth)

router.post('/', validate(createPackageSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { answers, title } = req.body as { answers: Parameters<typeof documentsService.createPackage>[1]; title?: string }
    const userId = Array.isArray(req.userId) ? req.userId[0] : req.userId
    const pkg = await documentsService.createPackage(userId!, answers, title)
    res.status(201).json({ package: pkg })
  } catch (err: unknown) {
    console.error('Create package error:', err)
    res.status(500).json({ error: 'Fehler beim Speichern.' })
  }
})

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const uid = Array.isArray(req.userId) ? req.userId[0] : req.userId
    const packages = await documentsService.listPackages(uid!)
    res.json({ packages })
  } catch {
    res.status(500).json({ error: 'Serverfehler.' })
  }
})

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const uid = (Array.isArray(req.userId) ? req.userId[0] : req.userId) as string
    const pkg = await documentsService.getPackage(req.params.id as string, uid)
    if (!pkg) {
      res.status(404).json({ error: 'Nicht gefunden.' })
      return
    }
    res.json({ package: pkg })
  } catch {
    res.status(500).json({ error: 'Serverfehler.' })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const uid = (Array.isArray(req.userId) ? req.userId[0] : req.userId) as string
    const result = await documentsService.deletePackage(req.params.id as string, uid)
    if (!result) {
      res.status(404).json({ error: 'Nicht gefunden.' })
      return
    }
    res.json({ message: 'Gelöscht.' })
  } catch {
    res.status(500).json({ error: 'Serverfehler.' })
  }
})

export { router as documentsRouter }
