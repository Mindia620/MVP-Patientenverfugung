import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/index.js'
import { generalLimiter } from './middleware/rateLimiter.js'
import { authRouter } from './modules/auth/auth.router.js'
import { documentsRouter } from './modules/documents/documents.router.js'
import { pdfRouter } from './modules/pdf/pdf.router.js'

const app = express()

app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
)

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(generalLimiter)

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/packages', documentsRouter)
app.use('/api/generate', pdfRouter)

app.use((_, res) => {
  res.status(404).json({ error: 'Nicht gefunden.' })
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Interner Serverfehler.' })
})

app.listen(config.port, () => {
  console.log(`🚀 Vorsorge Wizard API running on port ${config.port}`)
  console.log(`   Environment: ${config.nodeEnv}`)
  console.log(`   Database: ${config.databaseUrl ? 'configured' : 'NOT configured'}`)
})

export { app }
