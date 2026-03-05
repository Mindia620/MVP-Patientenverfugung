import { createHash } from 'crypto'
import { AuditAction } from '@prisma/client'
import { prisma } from './prisma'
import { Request } from 'express'

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip + 'vorsorge-salt').digest('hex')
}

export async function logAudit(params: {
  action: AuditAction
  userId?: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
  req?: Request
}): Promise<void> {
  try {
    const ipHash = params.req
      ? hashIp(params.req.ip ?? params.req.socket.remoteAddress ?? 'unknown')
      : undefined

    await prisma.auditLog.create({
      data: {
        action: params.action,
        userId: params.userId,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata as Record<string, string> | undefined,
        ipHash,
      },
    })
  } catch {
    // Audit failures must never crash the application
    console.error('[audit] Failed to write audit log:', params.action)
  }
}
