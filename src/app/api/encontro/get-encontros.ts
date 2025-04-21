import { prisma } from '@/lib/prisma'

export type SelectEncontros = {
  id: string
  numeroEncontro: number
}

export async function getEncontros() {
  const encontros = await prisma.encontro.findMany({
    select: {
      id: true,
      numeroEncontro: true,
    },
    orderBy: {
      numeroEncontro: 'desc',
    },
  })

  return encontros
}
