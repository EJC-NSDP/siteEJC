import { prisma } from '@/lib/prisma'

export interface EquipesMontagem {
  value: string
  label: string
}

export async function getEquipes(): Promise<EquipesMontagem[]> {
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
        { equipeValue: 'palestrante' },
        { equipeValue: 'pastoral' },
        { equipeValue: 'tio_externa' },
      ],
    },
  })

  return equipes.map((equipe) => {
    return {
      value: equipe.equipeValue,
      label: equipe.equipeLabel,
    }
  })
}
