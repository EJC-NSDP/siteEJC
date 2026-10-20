import { prisma } from '@/lib/prisma'

export async function getTodosEncontrosComAvaliacoes() {
  return prisma.encontro.findMany({
    orderBy: { numeroEncontro: 'desc' },
    select: {
      id: true,
      numeroEncontro: true,
      _count: { select: { avaliacoes: true } },
    },
  })
}
