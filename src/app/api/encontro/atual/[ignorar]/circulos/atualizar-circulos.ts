import { prisma } from '@/lib/prisma'

import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

interface CirculoPayload {
  id: string
  idCorCirculo: number
  tioAparente: string
  tioSecreto: string
  ativo: boolean
}

interface AtualizarCirculosPayload {
  order: number
  circulos: CirculoPayload[]
}

async function deletarCirculo(idCirculo: string) {
  await prisma.encontreiro.updateMany({
    where: { idCirculo },
    data: { idCirculo: null },
  })

  await prisma.circulo.update({
    where: { id: idCirculo },
    data: { idTioAparente: null, idTioSecreto: null },
  })

  await prisma.circulo.delete({ where: { id: idCirculo } })
}

export async function atualizarCirculos({
  order,
  circulos,
}: AtualizarCirculosPayload) {
  const currentEncontro = await getCurrentEncontro()
  if (!currentEncontro) return null

  await prisma.encontro.update({
    where: { id: currentEncontro.id },
    data: { ordemCirculos: order },
  })

  const existentes = await prisma.circulo.findMany({
    where: { idEncontro: currentEncontro.id },
    select: { id: true, idCorCirculo: true },
  })
  const existentesPorCor = Object.fromEntries(
    existentes.map((c) => [c.idCorCirculo, c.id]),
  )

  await Promise.all(
    circulos.map(async (circulo) => {
      const idExistente = existentesPorCor[circulo.idCorCirculo]

      if (circulo.ativo) {
        if (idExistente) {
          await prisma.circulo.update({
            where: { id: idExistente },
            data: {
              idTioAparente:
                circulo.tioAparente && circulo.tioAparente !== 'unknown'
                  ? circulo.tioAparente
                  : null,
              idTioSecreto:
                circulo.tioSecreto && circulo.tioSecreto !== 'unknown'
                  ? circulo.tioSecreto
                  : null,
            },
          })
        } else {
          await prisma.circulo.create({
            data: {
              idCorCirculo: circulo.idCorCirculo,
              idEncontro: currentEncontro.id,
              idTioAparente:
                circulo.tioAparente && circulo.tioAparente !== 'unknown'
                  ? circulo.tioAparente
                  : null,
              idTioSecreto:
                circulo.tioSecreto && circulo.tioSecreto !== 'unknown'
                  ? circulo.tioSecreto
                  : null,
            },
          })
        }
      } else {
        if (idExistente) {
          await deletarCirculo(idExistente)
        }
      }
    }),
  )
}
