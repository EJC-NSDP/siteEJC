import type { valueStatus } from '@/@types/enums'
import { prisma } from '@/lib/prisma'

export interface changeStatusRouteProps {
  id: string
  status: valueStatus
}
export async function changeStatus({ id, status }: changeStatusRouteProps) {
  if (status !== 'confirmado' && status !== 'confirmado_sem_sexta') {
    await prisma.encontreiro.update({
      data: {
        idCirculo: null,
      },
      where: {
        idPessoa: id,
      },
    })
    await prisma.encontrista.update({
      data: {
        idCarroEncontro: null,
      },
      where: {
        idPessoa: id,
      },
    })
  }
  return await prisma.encontrista.update({
    data: {
      idStatus: status,
    },
    where: {
      idPessoa: id,
    },
  })
}
