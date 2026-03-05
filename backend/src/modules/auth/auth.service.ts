import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../prisma/client.js'
import { config } from '../../config/index.js'

export const authService = {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new Error('E-Mail-Adresse ist bereits registriert.')
    }

    const hashed = await bcrypt.hash(password, config.bcryptRounds)
    const user = await prisma.user.create({
      data: { email, password: hashed },
      select: { id: true, email: true, createdAt: true },
    })

    return user
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      await bcrypt.hash('dummy-timing-protection', config.bcryptRounds)
      throw new Error('E-Mail-Adresse oder Passwort falsch.')
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('E-Mail-Adresse oder Passwort falsch.')
    }

    return { id: user.id, email: user.email, createdAt: user.createdAt }
  },

  signToken(userId: string): string {
    return jwt.sign({ userId }, config.jwtSecret, {
      expiresIn: '7d',
    })
  },

  cookieOptions() {
    return {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    }
  },
}
