import { Router } from 'express'
import { authService } from './auth.service.js'
import { authLimiter } from '../../middleware/rateLimiter.js'
import { validate } from '../../middleware/validate.js'
import { requireAuth, type AuthRequest } from '../../middleware/auth.js'
import { registerSchema, loginSchema } from './auth.schema.js'
import { prisma } from '../../prisma/client.js'
import type { Response } from 'express'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const user = await authService.register(req.body.email, req.body.password)
    const token = authService.signToken(user.id)
    res.cookie('token', token, authService.cookieOptions())
    res.status(201).json({ user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registrierung fehlgeschlagen.'
    res.status(409).json({ error: msg })
  }
})

router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const user = await authService.login(req.body.email, req.body.password)
    const token = authService.signToken(user.id)
    res.cookie('token', token, authService.cookieOptions())
    res.json({ user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen.'
    res.status(401).json({ error: msg })
  }
})

router.post('/logout', (_, res) => {
  res.clearCookie('token', { path: '/' })
  res.json({ message: 'Erfolgreich abgemeldet.' })
})

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, createdAt: true },
    })
    if (!user) {
      res.status(404).json({ error: 'Benutzer nicht gefunden.' })
      return
    }
    res.json({ user })
  } catch {
    res.status(500).json({ error: 'Serverfehler.' })
  }
})

export { router as authRouter }
