import { prisma } from '@/lib/prisma'

export type Funcao = {
  id: string
  label: string
}

export async function getFuncoes(): Promise<Funcao[]> {
  return await prisma.domainFuncoes.findMany({
    select: {
      id: true,
      label: true,
    },
    where: {
      NOT: [{ id: 'dirigente' }, { id: 'bp' }],
    },
    orderBy: {
      label: 'asc',
    },
  })
}
