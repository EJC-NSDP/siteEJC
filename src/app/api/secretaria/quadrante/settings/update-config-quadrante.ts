import type { UpdateQuadranteData } from './route'

import { prisma } from '@/lib/prisma'

export async function updateConfigQuadrante(configs: UpdateQuadranteData[]) {
  return Promise.all(
    configs.map(async (config) => {
      const existing = await prisma.quadrante.findUnique({
        where: { value: config.value },
        select: { value: true, imageUrl: true },
      })

      if (!existing) {
        return { value: config.value, status: 'not found' }
      }

      if (existing.imageUrl === config.imageUrl) {
        return { value: config.value, status: 'skipped' }
      }

      await prisma.quadrante.update({
        where: { value: config.value },
        data: { imageUrl: config.imageUrl },
      })

      return { value: config.value, status: 'updated' }
    }),
  )
}
