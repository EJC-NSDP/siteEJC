import { prisma } from '@/lib/prisma'

import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

interface CirculoPayload {
  id: string
  tioAparente: string
  tioSecreto: string
  ativo: boolean
}

interface AtualizarCirculosPayload {
  order: number
  circulos: CirculoPayload[]
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

  // 2. Atualiza tioAparente e tioSecreto de cada círculo
  //    - 'unknown' ou '' → null (sem tio definido)
  //    - inativos também passam (ativo: false) → tios já foram limpos no front
  await Promise.all(
    circulos.map((circulo) =>
      prisma.circulo.update({
        where: { id: circulo.id },
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
      }),
    ),
  )
}
