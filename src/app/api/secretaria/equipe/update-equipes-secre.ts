import { prisma } from '@/lib/prisma'
import type { EquipeSecre } from './get-equipes-secre'

export async function updateEquipesSecre(equipes: EquipeSecre[]) {
  return Promise.all(
    equipes.map(async (equipe) => {
      const existing = await prisma.domainEquipes.findUnique({
        where: { equipeValue: equipe.equipeValue },
        select: { description: true },
      })

      if (!existing) {
        return { equipeValue: equipe.equipeValue, status: 'not found' }
      }

      if (existing.description === equipe.description) {
        return { equipeValue: equipe.equipeValue, status: 'skipped' }
      }

      await prisma.domainEquipes.update({
        where: { equipeValue: equipe.equipeValue },
        data: { description: equipe.description },
      })

      return { equipeValue: equipe.equipeValue, status: 'updated' }
    }),
  )
}
