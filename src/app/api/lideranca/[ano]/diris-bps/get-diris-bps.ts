import { prisma } from '@/lib/prisma'

export interface DiriBP {
  nome: string
  funcao: string
  ano: number
}

export async function getDirisBPs(ano: number): Promise<DiriBP[]> {
  const dirisBps = await prisma.lideranca.findMany({
    select: {
      ano: true,
      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
        },
      },
      funcao: {
        select: {
          label: true,
        },
      },
    },
    where: {
      ano,
      OR: [{ idFuncao: 'dirigente' }, { idFuncao: 'bp' }],
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

  return dirisBps.map((lider) => {
    return {
      nome: `${lider.pessoa.nome} ${lider.pessoa.sobrenome}`,
      funcao: lider.funcao.label,
      ano: lider.ano,
    }
  })
}
