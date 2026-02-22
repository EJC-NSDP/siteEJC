import { type Prisma } from '@/generated'
import { prisma } from '@/lib/prisma'

export type CirculoSummaryData = {
  id: string
  numeroEncontro: number
  cor: string
  nome: string
  tioAparente: {
    id: string | null
    nome: string | null
  }
  tioSecreto: {
    id: string | null
    nome: string | null
  }
}

export type CirculosSummary = {
  pageIndex: number
  totalCount: number
  perPage: number
  circulos: CirculoSummaryData[]
}

type GetCirculosSummaryProps = {
  page: number
  encontroNumber: string | null
  colorLable: string | null
}

type GetCirculosProps = {
  page: number
  perPage: number
  encontroNumber: string | null
  colorLable: string | null
}

type GetTotalCirculosProps = {
  encontroNumber: string | null
  colorLable: string | null
}

async function getCirculos({
  page,
  perPage,
  encontroNumber,
  colorLable,
}: GetCirculosProps) {
  const skipData = page * perPage

  const encontroFilter: Prisma.EncontroWhereInput = encontroNumber
    ? {
        numeroEncontro: parseInt(encontroNumber, 10),
      }
    : {}

  const colorFilter: Prisma.DomainCorCirculoWhereInput =
    colorLable && colorLable !== 'all' ? { cor: colorLable } : {}

  return await prisma.circulo.findMany({
    skip: skipData,
    take: perPage,
    select: {
      id: true,
      nome: true,
      encontro: {
        select: {
          numeroEncontro: true,
        },
      },
      corCirculo: {
        select: {
          cor: true,
        },
      },
      tioAparente: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
        },
      },
      tioSecreto: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
        },
      },
    },
    where: {
      encontro: {
        ...encontroFilter,
      },
      corCirculo: {
        ...colorFilter,
      },
    },
    orderBy: [
      {
        encontro: {
          numeroEncontro: 'desc',
        },
      },
      {
        corCirculo: {
          id: 'asc',
        },
      },
    ],
  })
}

async function getTotal({ encontroNumber, colorLable }: GetTotalCirculosProps) {
  const encontroFilter: Prisma.EncontroWhereInput = encontroNumber
    ? {
        numeroEncontro: parseInt(encontroNumber, 10),
      }
    : {}

  const colorFilter: Prisma.DomainCorCirculoWhereInput =
    colorLable && colorLable !== 'all' ? { cor: colorLable } : {}

  return await prisma.circulo.count({
    where: {
      encontro: {
        ...encontroFilter,
      },
      corCirculo: {
        ...colorFilter,
      },
    },
  })
}

function transformToCirculosSummaryData(
  circulos: {
    id: string
    nome: string | null
    encontro: {
      numeroEncontro: number
    }
    corCirculo: {
      cor: string
    }
    tioAparente: {
      id: string
      nome: string
      sobrenome: string
      apelido: string | null
    } | null
    tioSecreto: {
      id: string
      nome: string
      sobrenome: string
      apelido: string | null
    } | null
  }[],
): CirculoSummaryData[] {
  return circulos.map((circulo) => {
    return {
      id: circulo.id,
      numeroEncontro: circulo.encontro.numeroEncontro || 0,
      cor: circulo.corCirculo.cor,
      nome: circulo.nome || '[Preencher]',
      tioAparente: {
        id: circulo.tioAparente?.id || '',
        nome: circulo.tioAparente
          ? `${circulo.tioAparente.nome} ${circulo.tioAparente.sobrenome} (${circulo.tioAparente.apelido} )`
          : 'Não sabemos',
      },
      tioSecreto: {
        id: circulo.tioSecreto?.id || '',
        nome: circulo.tioSecreto
          ? `${circulo.tioSecreto.nome} ${circulo.tioSecreto.sobrenome} (${circulo.tioSecreto.apelido} )`
          : 'Não sabemos',
      },
    }
  })
}

export async function getCirculosSummary({
  page,
  encontroNumber,
  colorLable,
}: GetCirculosSummaryProps) {
  const perPage = 25

  const totalCirculos = await getTotal({
    encontroNumber,
    colorLable,
  })

  const circulos = await getCirculos({
    page,
    perPage,
    encontroNumber,
    colorLable,
  })

  if (!circulos) {
    return null
  }

  const circulosResponse = transformToCirculosSummaryData(circulos)

  const response: CirculosSummary = {
    totalCount: totalCirculos,
    pageIndex: page + 1,
    perPage,
    circulos: circulosResponse,
  }

  return response
}
