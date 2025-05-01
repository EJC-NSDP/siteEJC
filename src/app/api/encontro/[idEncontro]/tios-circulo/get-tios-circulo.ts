import { prisma } from '@/lib/prisma'

export interface SelectTiosEncontro {
  id: string
  numeroEncontro: string
  nome: string
}

export async function getTiosCirculos(idEncontro: string) {
  const foundEncontro = await prisma.encontro.findUnique({
    where: {
      id: idEncontro,
    },
  })

  if (!foundEncontro) return null

  const tios = await prisma.equipeEncontro.findMany({
    select: {
      encontreiro: {
        select: {
          pessoa: {
            select: {
              id: true,
              nome: true,
              sobrenome: true,
            },
          },
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
        },
      },
    },
    where: {
      idEncontro: foundEncontro.id,
      OR: [
        { idEquipe: 'tio_aparente' },
        { idEquipe: 'tio_secreto' },
        { idEquipe: 'tio_circulo' },
      ],
    },
    orderBy: {
      encontreiro: {
        pessoa: {
          nome: 'asc',
        },
      },
    },
  })

  const response: SelectTiosEncontro[] = tios.map((tio) => {
    return {
      id: tio.encontreiro.pessoa.id,
      numeroEncontro:
        tio.encontreiro.encontro?.numeroEncontro.toString() || '0',
      nome: `${tio.encontreiro.pessoa.nome} ${tio.encontreiro.pessoa.sobrenome}`,
    }
  })

  return response
}
