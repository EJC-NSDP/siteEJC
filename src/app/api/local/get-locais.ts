import { prisma } from '@/lib/prisma'

export interface LocalOption {
  id: string
  nomeLocal: string
  numeroLocal: string
  enderecoCep: string
  endereco?: {
    rua: string
    bairro: string
    cidade: string
    estado: string
  }
}

export async function getLocais(): Promise<LocalOption[]> {
  return prisma.local.findMany({
    select: {
      id: true,
      nomeLocal: true,
      numeroLocal: true,
      enderecoCep: true,
      endereco: {
        select: {
          rua: true,
          bairro: true,
          cidade: true,
          estado: true,
        },
      },
    },
  })
}
