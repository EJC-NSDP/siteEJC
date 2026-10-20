import { prisma } from '@/lib/prisma'

export async function getLocais() {
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
