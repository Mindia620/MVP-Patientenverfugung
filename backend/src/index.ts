import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import authRoutes from './routes/auth'
import wizardRoutes from './routes/wizard'
import documentRoutes from './routes/documents'
import userRoutes from './routes/users'
import { errorHandler } from './middleware/errorHandler'
import { closeBrowser } from './services/pdf.service'

const app = express()
const PORT = parseInt(process.env.PORT ?? '3001', 10)
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
)

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(cookieParser())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later.' },
})

app.use(globalLimiter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/wizard', wizardRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`[server] Vorsorge Wizard API running on http://localhost:${PORT}`)
})

process.on('SIGTERM', async () => {
  console.log('[server] SIGTERM received, shutting down gracefully')
  await closeBrowser()
  server.close(() => process.exit(0))
})

process.on('SIGINT', async () => {
  await closeBrowser()
  server.close(() => process.exit(0))
})

export default app
