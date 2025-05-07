import { prisma } from '@/lib/prisma'

export interface ListEncontreiros {
  id: string
  nome: string
  encontro: string
}

export async function listAllEncontreiros(): Promise<ListEncontreiros[]> {
  const encontreiros = await prisma.pessoa.findMany({
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      encontreiro: {
        select: {
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
        },
      },
    },
    where: {
      NOT: [{ role: 'ENCONTRISTA' }, { role: 'TIOEXTERNA' }],
    },
    orderBy: {
      nome: 'asc',
    },
  })

  return encontreiros.map((encontreiro) => {
    return {
      id: encontreiro.id,
      nome: `${encontreiro.nome} ${encontreiro.sobrenome}`,
      encontro:
        encontreiro.encontreiro?.encontro?.numeroEncontro.toString() || '?',
    }
  })
}
