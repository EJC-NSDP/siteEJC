import { prisma } from '@/lib/prisma'

export interface DeletePastoralProps {
  id: string
  ano: string
}

export async function deletePastoral({ id, ano }: DeletePastoralProps) {
  return await prisma.lideranca.delete({
    where: {
      idPessoa_ano: {
        idPessoa: id,
        ano: parseInt(ano, 10),
      },
    },
  })
}
