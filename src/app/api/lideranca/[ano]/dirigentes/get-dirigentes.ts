import { prisma } from '@/lib/prisma'

export interface Diri {
  id: string
  nome: string
  dom: string | null
  pasta: string | null
  ano: number
}

export async function getDirigentes(ano: number): Promise<Diri[]> {
  const diris = await prisma.lideranca.findMany({
    select: {
      ano: true,
      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
        },
      },
      idPessoa: true,
      idDom: true,
      idPasta: true,
    },
    where: {
      ano,
      OR: [{ idFuncao: 'dirigente' }],
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

  return diris.map((lider) => {
    return {
      id: lider.idPessoa,
      nome: `${lider.pessoa.nome} ${lider.pessoa.sobrenome}`,
      dom: lider.idDom,
      pasta: lider.idPasta,
      ano: lider.ano,
    }
  })
}
