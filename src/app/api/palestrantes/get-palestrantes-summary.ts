import { prisma } from '@/lib/prisma'

export async function getPalestrantes() {
  return await prisma.palestrantes.findMany({
    select: {
      nome: true,
      order: true,
      encontro: {
        select: {
          numeroEncontro: true,
        },
      },
      palestra: {
        select: {
          nome: true,
        },
      },
    },
    orderBy: [
      {
        encontro: {
          numeroEncontro: 'desc',
        },
      },
      {
        order: 'asc',
      },
    ],
  })
}
