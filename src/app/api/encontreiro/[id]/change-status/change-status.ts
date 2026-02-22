import type { StatusEncontreiro } from '@/enums'
import { prisma } from '@/lib/prisma'

export interface changeStatusMontagemRouteProps {
  id: string
  status: StatusEncontreiro
}
export async function changeStatusMontagem({
  id,
  status,
}: changeStatusMontagemRouteProps) {
  return await prisma.encontreiro.update({
    data: {
      statusMontagem: status,
    },
    where: {
      idPessoa: id,
    },
  })
}
