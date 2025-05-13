import type { PalestrasData } from '@/app/(app)/admin/secretaria/palestras/pageComponents/PalestraForm'
import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

export async function updatePalestrantes({ palestras }: PalestrasData) {
  const currentEncontro = await getCurrentEncontro()
  if (!currentEncontro) return null

  const idEncontro = currentEncontro.id

  // IDs de palestras recebidas no formulário
  const receivedIds = palestras.map((p) => parseInt(p.idPalestra, 10))

  // Buscar palestras existentes para o encontro atual
  const existingPalestrantes = await prisma.palestrantes.findMany({
    where: {
      idEncontro,
    },
    select: {
      idPalestra: true,
    },
  })

  // Identificar quais devem ser removidos
  const toDelete = existingPalestrantes
    .filter((p) => !receivedIds.includes(p.idPalestra))
    .map((p) => p.idPalestra)

  // Deletar os que não estão mais na lista
  await prisma.palestrantes.deleteMany({
    where: {
      idEncontro,
      idPalestra: { in: toDelete },
    },
  })

  // Upsert dos atuais
  return Promise.all(
    palestras.map((palestra, index) =>
      prisma.palestrantes.upsert({
        create: {
          order: index,
          idEncontro,
          idPalestra: parseInt(palestra.idPalestra, 10),
          nome: palestra.nomePalestrante,
        },
        update: {
          order: index,
          nome: palestra.nomePalestrante,
        },
        where: {
          idEncontro_idPalestra: {
            idEncontro,
            idPalestra: parseInt(palestra.idPalestra, 10),
          },
        },
      }),
    ),
  )
}
