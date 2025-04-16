// eslint-disable-next-line prettier/prettier
import { prisma } from '@/lib/prisma';
// eslint-disable-next-line prettier/prettier
import { type Prisma, type StatusEncontreiro } from '@prisma/client';

// Campos válidos para ordenação
export const validOrderFields = [
  'createdAt',
  'nome',
  'celular',
  'dataNasc',
  'bairro',
] as const

// Mapeamento de campos para suas respectivas relações
const fieldMappings: Record<
  string,
  { relation?: string; nestedRelation?: string }
> = {
  bairro: { relation: 'encontreiro', nestedRelation: 'enderecoEncontro' },
  dataNasc: { relation: 'encontreiro' },
}

type OrderByField = (typeof validOrderFields)[number]

export type EncontreiroSummaryData = {
  id: string
  numeroEncontro: number
  nome: string
  sobrenome: string
  bairro: string
  celular: string
  slug: string
  dataNasc: Date | null
  statusMontagem: StatusEncontreiro | null
  circulo: {
    nome: string | null
    cor: string | null
  }
}

export type EncontreiroSummary = {
  pageIndex: number
  totalCount: number
  perPage: number
  encontreiros: EncontreiroSummaryData[]
}

type GetEncontreirosSummaryProps = {
  page: number
  encontreiroName: string | null
  orderByField: string | null
  orderDirection: string | null
}

type getEncontreirosProps = {
  page: number
  perPage: number
  encontreiroName: string | null
  orderByField: string | null
  orderDirection: string | null
}

type getTotalEncontreirosProps = {
  encontreiroName: string | null
}

async function getEncontreiros({
  page,
  perPage,
  encontreiroName,
  orderByField,
  orderDirection,
}: getEncontreirosProps) {
  const skipData = page * perPage

  const nameParts = encontreiroName ? encontreiroName.split(' ') : []

  const nameFilter: Prisma.PessoaWhereInput = encontreiroName
    ? {
        OR: nameParts.flatMap((part) => [
          { nome: { contains: part, mode: 'insensitive' } },
          { sobrenome: { contains: part, mode: 'insensitive' } },
        ]),
      }
    : {}

  const orderBy: Prisma.PessoaOrderByWithRelationInput[] = []
  const direction =
    orderDirection === 'asc' || orderDirection === 'desc'
      ? orderDirection
      : 'asc'

  if (orderByField && validOrderFields.includes(orderByField as OrderByField)) {
    const mapping = fieldMappings[orderByField] || {}

    if (orderByField === 'nome') {
      // Ordenação específica para nome e sobrenome
      orderBy.push({ nome: direction }, { sobrenome: direction })
    } else if (mapping.relation) {
      // Ordenação para campos mapeados
      const orderObject = mapping.nestedRelation
        ? {
            [mapping.relation]: {
              [mapping.nestedRelation]: { [orderByField]: direction },
            },
          }
        : { [mapping.relation]: { [orderByField]: direction } }
      orderBy.push(orderObject)
    } else {
      // Ordenação padrão
      orderBy.push({ [orderByField]: direction })
    }
  } else {
    // Ordenação padrão por 'nome' se o campo for inválido
    orderBy.push({ nome: 'asc' })
  }

  return await prisma.pessoa.findMany({
    skip: skipData,
    take: perPage,
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      celular: true,
      slug: true,
      endereco: {
        select: {
          bairro: true,
        },
      },
      encontreiro: {
        select: {
          dataNasc: true,
          statusMontagem: true,
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
          circulo: {
            select: {
              nome: true,
              corCirculo: {
                select: {
                  cor: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      NOT: [{ role: 'ENCONTRISTA' }],
      ...nameFilter,
    },
    orderBy,
  })
}

async function getTotal({ encontreiroName }: getTotalEncontreirosProps) {
  if (encontreiroName) {
    return await prisma.pessoa.count({
      where: {
        NOT: [{ role: 'ENCONTRISTA' }],
        OR: [
          { nome: { contains: encontreiroName } },
          { sobrenome: { contains: encontreiroName } },
        ],
      },
    })
  }

  return await prisma.pessoa.count({
    where: {
      NOT: [{ role: 'ENCONTRISTA' }],
    },
  })
}

function transformToEncontreiroSummaryData(
  encontreiros: {
    id: string
    nome: string
    sobrenome: string
    celular: string
    slug: string
    endereco: {
      bairro: string
    }
    encontreiro: {
      dataNasc: Date | null
      statusMontagem: StatusEncontreiro | null
      encontro: {
        numeroEncontro: number
      } | null
      circulo: {
        nome: string | null
        corCirculo: {
          cor: string
        }
      } | null
    } | null
  }[],
): EncontreiroSummaryData[] {
  return encontreiros.map((encontreiro) => {
    return {
      id: encontreiro.id,
      numeroEncontro: encontreiro.encontreiro?.encontro?.numeroEncontro || 0,
      nome: encontreiro.nome,
      sobrenome: encontreiro.sobrenome,
      celular: encontreiro.celular,
      dataNasc: encontreiro.encontreiro?.dataNasc || null,
      bairro: encontreiro.endereco.bairro || 'N/A',
      statusMontagem: encontreiro.encontreiro?.statusMontagem || null,
      slug: encontreiro.slug,
      circulo: {
        nome: encontreiro.encontreiro?.circulo?.nome || null,
        cor: encontreiro.encontreiro?.circulo?.corCirculo.cor || null,
      },
    }
  })
}

export async function getEncontreirosSummary({
  page,
  encontreiroName,
  orderByField,
  orderDirection,
}: GetEncontreirosSummaryProps) {
  const perPage = 25

  const totalEncontreiro = await getTotal({
    encontreiroName,
  })

  const encontreiros = await getEncontreiros({
    page,
    perPage,
    encontreiroName,
    orderByField,
    orderDirection,
  })

  if (!encontreiros) {
    return null
  }

  const encontreirosResponse = transformToEncontreiroSummaryData(encontreiros)

  const response: EncontreiroSummary = {
    totalCount: totalEncontreiro,
    pageIndex: page + 1,
    perPage,
    encontreiros: encontreirosResponse,
  }

  return response
}
