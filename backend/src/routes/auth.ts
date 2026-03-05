import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'
import { logAudit } from '../lib/audit'
import { requireAuth } from '../middleware/auth'

const router = Router()

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function setCookieToken(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  })
}

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = RegisterSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    })

    const token = signToken({ userId: user.id, email: user.email })
    setCookieToken(res, token)

    await logAudit({ action: 'USER_REGISTER', userId: user.id, req })

    res.status(201).json({ user })
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = LoginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    })

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = signToken({ userId: user.id, email: user.email })
    setCookieToken(res, token)

    await logAudit({ action: 'USER_LOGIN', userId: user.id, req })

    res.json({
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', requireAuth, async (req: Request, res: Response) => {
  res.clearCookie('token', { path: '/' })
  await logAudit({ action: 'USER_LOGOUT', userId: req.user?.userId, req })
  res.json({ message: 'Logged out' })
})

router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId, deletedAt: null },
      select: { id: true, email: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ user })
  } catch (err) {
    next(err)
  }
})

export default router
