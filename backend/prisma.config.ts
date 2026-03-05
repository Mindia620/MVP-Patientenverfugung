import path from 'node:path'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    adapter: async () => {
      const { PrismaPg } = await import('@prisma/adapter-pg')
      const { Pool } = await import('pg')
      const connectionString =
        process.env.DATABASE_URL ??
        'postgresql://vorsorge:vorsorge_dev@localhost:5432/vorsorge_wizard'
      const pool = new Pool({ connectionString })
      return new PrismaPg(pool)
    },
    url:
      process.env.DATABASE_URL ??
      'postgresql://vorsorge:vorsorge_dev@localhost:5432/vorsorge_wizard',
  },
})
