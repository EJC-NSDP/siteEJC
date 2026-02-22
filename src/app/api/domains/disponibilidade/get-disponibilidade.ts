import type { Value_Disponibilidade as valueDisponibilidade } from '@/generated'
import { prisma } from '@/lib/prisma'

export type Disponibilidade = {
  id: valueDisponibilidade
  disponibilidade: string
  descricao: string
}

export async function getDisponibilidade() {
  const disponibilidade: Disponibilidade[] =
    await prisma.domainDisponibilidade.findMany({
      where: {
        NOT: { id: 'NAO_PREENCHEU' },
      },
      select: {
        id: true,
        disponibilidade: true,
        descricao: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

  return disponibilidade
}
