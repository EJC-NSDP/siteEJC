import { prisma } from '@/lib/prisma'

export async function getDAAberto(): Promise<boolean> {
  const encontro = await prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true },
  })

  if (!encontro) return false

  const da = await prisma.diaAmizade.findUnique({
    where: { idEncontro: encontro.id },
    select: { aberto: true },
  })

  return da?.aberto ?? false
}
