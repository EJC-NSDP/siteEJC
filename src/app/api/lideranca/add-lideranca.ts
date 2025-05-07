import type { LiderancaFormData } from '@/@types/lideranca'
import { prisma } from '@/lib/prisma'

export async function addLideranca({
  idPessoa,
  idFuncao,
  ano,
}: LiderancaFormData) {
  return await prisma.lideranca.upsert({
    create: {
      idPessoa,
      idFuncao,
      ano: parseInt(ano, 10),
    },
    update: {
      idFuncao,
    },
    where: {
      idPessoa_ano: {
        idPessoa,
        ano: parseInt(ano, 10),
      },
    },
  })
}
