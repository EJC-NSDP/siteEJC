import { prisma } from '@/lib/prisma'

export type Cor = {
  id: number
  cor: string
}

export async function getCores() {
  const cores: Cor[] = await prisma.domainCorCirculo.findMany({
    select: {
      id: true,
      cor: true,
    },
  })

  return cores
}
