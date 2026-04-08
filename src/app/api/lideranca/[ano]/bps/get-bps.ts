import { prisma } from '@/lib/prisma'

export interface BP {
  id: string
  nome: string
  ano: number
}

export async function getBPs(ano: number): Promise<BP[]> {
  const bps = await prisma.lideranca.findMany({
    select: {
      ano: true,
      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
        },
      },
      idPessoa: true,
    },
    where: {
      ano,
      OR: [{ idFuncao: 'bp' }],
    },
    orderBy: [
      {
        idFuncao: 'desc',
      },
      {
        pessoa: {
          nome: 'asc',
        },
      },
    ],
  })

  return bps.map((lider) => {
    return {
      id: lider.idPessoa,
      nome: `${lider.pessoa.nome} ${lider.pessoa.sobrenome}`,
      ano: lider.ano,
    }
  })
}
