import { getCurrentEncontro } from './atual/[ignorar]/get-current-encontro/get-current-encontro'

import { prisma } from '@/lib/prisma'
import { createSlugForEncontrista } from '@/utils/create-slug'

export async function createEncontro() {
  const encontroAtual = await getCurrentEncontro()

  const local = await prisma.local.findFirst({
    where: {
      enderecoCep: '22460-012',
    },
  })

  const numeroEncontro = encontroAtual ? encontroAtual.numeroEncontro + 1 : 1
  const idLocal = local?.id ?? '1'

  const encontristas = await prisma.pessoa.findMany({
    where: {
      role: 'ENCONTRISTA',
    },
  })

  encontristas.map(async (encontrista) => {
    const slug = createSlugForEncontrista(encontrista.email, numeroEncontro)

    await prisma.pessoa.update({
      data: {
        slug,
      },
      where: {
        id: encontrista.id,
      },
    })
  })

  const newEncontro = await prisma.encontro.create({
    data: {
      numeroEncontro,
      numeroCirculos: 0,
      idLocal,
    },
  })

  return newEncontro
}
