import { prisma } from '@/lib/prisma'

interface CirculoPayload {
  id: string
  tioAparente: string // id da Pessoa ou 'unknown' ou ''
  tioSecreto: string // id da Pessoa ou 'unknown' ou ''
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
  // 1. Atualiza ordemCirculos no encontro atual
  await prisma.encontro.updateMany({
    where: { isReceivingCartas: false }, // encontro aberto/ativo
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
