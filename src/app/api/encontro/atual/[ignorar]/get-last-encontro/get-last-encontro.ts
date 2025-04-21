import { prisma } from '@/lib/prisma'

export async function getLastEncontro() {
  const encontro = await prisma.encontro.findMany({
    take: 2,
    include: {
      local: true,
    },
    orderBy: {
      numeroEncontro: 'desc',
    },
  })

  return encontro[1]
}
