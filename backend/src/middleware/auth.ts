import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export interface AuthRequest extends Request {
  userId?: string
}

interface JwtPayload {
  userId: string
  iat: number
  exp: number
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.token as string | undefined

  if (!token) {
    res.status(401).json({ error: 'Nicht angemeldet' })
    return
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ error: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.' })
  }
}
