import { prisma } from '../../prisma/client.js'
import type { WizardAnswersData } from './documents.schema.js'

export const documentsService = {
  async createPackage(userId: string, answers: WizardAnswersData, title?: string) {
    const pkg = await prisma.documentPackage.create({
      data: {
        userId,
        title: title ?? 'Vorsorge-Dokumente',
        answers: {
          create: {
            data: answers as unknown as Record<string, unknown>,
          },
        },
      },
      include: {
        generatedDocuments: true,
      },
    })
    return pkg
  },

  async listPackages(userId: string) {
    return prisma.documentPackage.findMany({
      where: { userId },
      include: { generatedDocuments: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getPackage(packageId: string, userId: string) {
    const pkg = await prisma.documentPackage.findFirst({
      where: { id: packageId, userId },
      include: {
        answers: true,
        generatedDocuments: true,
      },
    })
    return pkg
  },

  async deletePackage(packageId: string, userId: string) {
    const pkg = await prisma.documentPackage.findFirst({
      where: { id: packageId, userId },
    })
    if (!pkg) return null

    await prisma.documentPackage.delete({ where: { id: packageId } })
    return true
  },
}
