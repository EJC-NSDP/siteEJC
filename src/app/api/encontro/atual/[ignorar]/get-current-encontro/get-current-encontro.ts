import { prisma } from '@/lib/prisma'

export interface CurrentEncontro {
  id: string
  numeroEncontro: number
  idLocal: string
  temaEspiritual: string | null
  temaFantasia: string | null
  numeroCirculos: number
  dataInicio: Date
  dataTema: Date
  createdAt: Date
  modifiedAt: Date
  ordemCirculos: number
  isReceivingCartas: boolean
  local: {
    id: string
    enderecoCep: string
    nomeLocal: string
    numeroLocal: string
  }
}

export async function getCurrentEncontro(): Promise<CurrentEncontro | null> {
  return await prisma.encontro.findFirst({
    include: {
      local: true,
    },
    orderBy: {
      numeroEncontro: 'desc',
    },
  })
}
