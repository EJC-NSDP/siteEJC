import { prisma } from '@/lib/prisma'

export interface PessoaPastoral {
  id: string
  nome: string
  pastoral: string
  ano: number
}

export async function getPastorais(ano: number): Promise<PessoaPastoral[]> {
  const dirisBps = await prisma.lideranca.findMany({
    select: {
      idPessoa: true,
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
      NOT: [{ idFuncao: 'dirigente' }, { idFuncao: 'bp' }],
    },
    orderBy: [
      {
        funcao: {
          label: 'asc',
        },
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
      id: lider.idPessoa,
      nome: `${lider.pessoa.nome} ${lider.pessoa.sobrenome}`,
      pastoral: lider.funcao.label,
      ano: lider.ano,
    }
  })
}
