import { prisma } from '@/lib/prisma'
import { idPertenceARosa, idPertenceASala } from '@/utils/pertence'

export interface EquipesMontagemAggregated {
  equipeValue: string
  equipeLabel: string
}

export async function getEquipes(): Promise<EquipesMontagemAggregated[]> {
  const equipes = await prisma.domainEquipes.findMany({
    select: {
      equipeValue: true,
      equipeLabel: true,
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
    { equipeValue: 'sem_equipe', equipeLabel: 'Sem equipe' },
    { equipeValue: 'sala', equipeLabel: 'Sala' },
    { equipeValue: 'rosa', equipeLabel: 'Rosa' },
  ]

  const filteredTropa = equipes.filter(
    (equipe) =>
      !idPertenceASala(equipe.equipeValue) &&
      !idPertenceARosa(equipe.equipeValue),
  )

  return [...fixedEquipes, ...filteredTropa]
}
