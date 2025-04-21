import { prisma } from '@/lib/prisma'

export async function getCurrentEncontro() {
  return await prisma.encontro.findFirst({
    include: {
      local: true,
    },
    orderBy: {
      numeroEncontro: 'desc',
    },
  })
}
