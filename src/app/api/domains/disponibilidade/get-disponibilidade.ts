import { prisma } from '@/lib/prisma'
import type { Value_Disponibilidade as valueDisponibilidade } from '@prisma/client'

export type Disponibilidade = {
  id: valueDisponibilidade
  disponibilidade: string
  descricao: string
}

export async function getDisponibilidade() {
  const disponibilidade: Disponibilidade[] =
    await prisma.domainDisponibilidade.findMany({
      select: {
        id: true,
        disponibilidade: true,
        descricao: true,
      },
    })

  return disponibilidade
}
