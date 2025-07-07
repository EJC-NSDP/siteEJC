import { prisma } from '@/lib/prisma'

export interface EquipesEncontro {
  equipeValue: string
  equipeLabel: string
}

export async function getEquipes() {
  const equipes: EquipesEncontro[] = await prisma.domainEquipes.findMany({
    select: {
      equipeValue: true,
      equipeLabel: true,
    },
    orderBy: {
      equipeLabel: 'asc',
    },
  })

  return equipes
}
