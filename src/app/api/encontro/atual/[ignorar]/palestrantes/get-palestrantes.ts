import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

export async function getPalestrantesAtual() {
  const currentEncontro = await getCurrentEncontro()

  if (!currentEncontro) return null

  return await prisma.palestrantes.findMany({
    select: {
      id: true,
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
    where: {
      idEncontro: currentEncontro.id,
    },
    orderBy: {
      order: 'asc',
    },
  })
}
