import { prisma } from '@/lib/prisma'

export interface SelectCirculoEncontro {
  id: string
  corLabel: string
  nome: string
}

export async function getCirculos(idEncontro: string) {
  const foundEncontro = await prisma.encontro.findUnique({
    where: {
      id: idEncontro,
    },
  })

  if (!foundEncontro) return null

  const circulos = await prisma.circulo.findMany({
    select: {
      id: true,
      corCirculo: {
        select: {
          cor: true,
        },
      },
      nome: true,
    },
    where: {
      idEncontro: foundEncontro.id,
    },
    orderBy: {
      idCorCirculo: 'asc',
    },
  })

  const response: SelectCirculoEncontro[] = circulos.map((circulo) => {
    return {
      id: circulo.id,
      corLabel: circulo.corCirculo.cor,
      nome: circulo.nome ? circulo.nome : '',
    }
  })

  return response
}
