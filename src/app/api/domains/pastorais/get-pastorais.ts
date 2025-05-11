import { prisma } from '@/lib/prisma'

export type Pastoral = {
  id: string
  label: string
  logo: string | null
}

export async function getPastorais() {
  const pastorais: Pastoral[] = await prisma.domainFuncoes.findMany({
    select: {
      id: true,
      label: true,
      logo: true,
    },
    where: {
      NOT: [{ id: 'dirigente' }, { id: 'bp' }],
    },
    orderBy: {
      label: 'asc',
    },
  })

  return pastorais
}
