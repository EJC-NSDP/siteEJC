import { prisma } from '@/lib/prisma'

export type PossiveisTiosExterna = {
  id: string
  nome: string
  encontro?: string
  roles: string[]
}

export async function getPossiveisExternas() {
  const pessoasExterna = await prisma.pessoa.findMany({
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      roles: true,
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
      NOT: { roles: { hasSome: ['ENCONTRISTA', 'TIOSECRETO'] } },
    },
    orderBy: {
      nome: 'asc',
    },
  })

  const tiosExterna = pessoasExterna.map((pessoaExterna) => {
    if (pessoaExterna.encontreiro && pessoaExterna.encontreiro.encontro) {
      return {
        id: pessoaExterna.id,
        nome: pessoaExterna.nome + ' ' + pessoaExterna.sobrenome,
        encontro: pessoaExterna.encontreiro.encontro.numeroEncontro,
        roles: pessoaExterna.roles,
      }
    } else {
      return {
        id: pessoaExterna.id,
        nome: pessoaExterna.nome + ' ' + pessoaExterna.sobrenome,
        roles: pessoaExterna.roles,
      }
    }
  })

  return tiosExterna
}
