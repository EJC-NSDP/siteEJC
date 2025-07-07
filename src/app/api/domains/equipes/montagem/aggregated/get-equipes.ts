import { prisma } from '@/lib/prisma'
import { idPertenceARosa, idPertenceASala } from '@/utils/pertence'

export interface EquipesMontagemAggregated {
  equipeValue: string
}

export async function getEquipes(): Promise<EquipesMontagemAggregated[]> {
  const equipes = await prisma.domainEquipes.findMany({
    select: {
      equipeValue: true,
    },
    orderBy: {
      equipeLabel: 'asc',
    },
    where: {
      NOT: [
        { equipeValue: '0' },
        { equipeValue: 'bom_pastor' },
        { equipeValue: 'dirigente' },
        { equipeValue: 'nao_participara' },
        { equipeValue: 'palestrante' },
        { equipeValue: 'pastoral' },
        { equipeValue: 'tio_externa' },
      ],
    },
  })

  const fixedEquipes = [
    { equipeValue: 'sem_equipe' },
    { equipeValue: 'sala' },
    { equipeValue: 'rosa' },
  ]

  const filteredTropa = equipes.filter(
    (equipe) =>
      !idPertenceASala(equipe.equipeValue) &&
      !idPertenceARosa(equipe.equipeValue),
  )

  return [...fixedEquipes, ...filteredTropa]
}
