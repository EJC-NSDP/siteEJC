import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export interface PessoaPastoral {
  id: string
  nome: string
  pastoral: string
  ano: number
}

interface GetPastoraisProps {
  ano: number
  encontreiroName: string | null
  pastoral: string | null
}

export async function getPastorais({
  ano,
  encontreiroName,
  pastoral,
}: GetPastoraisProps): Promise<PessoaPastoral[]> {
  const nameParts = encontreiroName ? encontreiroName.split(' ') : []

  const nameFilter: Prisma.PessoaWhereInput = encontreiroName
    ? {
        OR: nameParts.flatMap((part) => [
          { nome: { contains: part, mode: 'insensitive' } },
          { sobrenome: { contains: part, mode: 'insensitive' } },
        ]),
      }
    : {}

  const pastoralFilter: Prisma.LiderancaWhereInput =
    pastoral && pastoral !== 'all' ? { idFuncao: pastoral } : {}

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
      pessoa: {
        ...nameFilter,
      },
      ...pastoralFilter,
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
