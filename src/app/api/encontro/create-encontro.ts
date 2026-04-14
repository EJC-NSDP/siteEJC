import { prisma } from '@/lib/prisma'
import { createSlugForEncontrista } from '@/utils/create-slug'

import { getCurrentEncontro } from './atual/[ignorar]/get-current-encontro/get-current-encontro'

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
      roles: { hasSome: ['ENCONTRISTA'] },
    },
  })

  const newEncontro = await prisma.encontro.create({
    data: {
      numeroEncontro,
      numeroCirculos: 0,
      idLocal,
    },
  })

  encontristas.map(async (encontrista) => {
    const slug = createSlugForEncontrista(encontrista.email, numeroEncontro)

    await prisma.pessoa.update({
      data: {
        encontreiro:{
          update:{
            idEncontro: newEncontro.id,
          },
        },
        slug,
      },
      where: {
        id: encontrista.id,
      },
    })
  })

  return newEncontro
}
