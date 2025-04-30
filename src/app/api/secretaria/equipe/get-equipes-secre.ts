import { prisma } from '@/lib/prisma'

export interface EquipeSecre {
  equipeValue: string
  equipeLabel: string
  description: string
}

export async function getEquipesSecre() {
  const equipes = await prisma.domainEquipes.findMany({
    select: {
      equipeValue: true,
      equipeLabel: true,
      description: true,
    },
    where: {
      NOT: [{ description: null }],
    },
    orderBy: {
      equipeLabel: 'asc',
    },
  })

  return equipes.map((equipe) => {
    return {
      equipeValue: equipe.equipeValue,
      equipeLabel: equipe.equipeLabel,
      description: equipe.description || '',
    }
  })
}
