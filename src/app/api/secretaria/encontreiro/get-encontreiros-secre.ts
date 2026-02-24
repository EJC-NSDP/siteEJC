import { type Prisma } from '@/generated'
import { prisma } from '@/lib/prisma'

import { getCurrentEncontro } from '../../encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'

// Campos válidos para ordenação
export const validOrderFields = [
  'nome',
  'numeroEncontro',
  'equipeLabel',
  'fichaPreenchida',
] as const

// Mapeamento de campos para suas respectivas relações
const fieldMappings: Record<
  string,
  { relation?: string; nestedRelation?: string }
> = {
  nome: { relation: 'encontreiro', nestedRelation: 'pessoa' },
  numeroEncontro: { relation: 'encontreiro', nestedRelation: 'encontro' },
  equipeLabel: { relation: 'equipe' },
}

type OrderByField = (typeof validOrderFields)[number]

export type EncontreiroSecreSummaryData = {
  id: string
  nome: string
  sobrenome: string
  apelido: string | null
  celular: string
  bairro: string
  instagram: string | null
  coordena: boolean
  slug: string
  numeroEncontro: number
  equipe: string
  fichaPreenchida: boolean
}

export type EncontreiroSecreSummary = {
  pageIndex: number
  totalCount: number
  perPage: number
  encontreiros: EncontreiroSecreSummaryData[]
}

type GetEncontreirosSecreSummaryProps = {
  page: number
  encontreiroName: string | null
  encontreiroEquipe: string | null
  encontreiroFicha: string | null
  orderByField: string | null
  orderDirection: string | null
}

type GetEncontreirosSecreProps = {
  encontroId: string
  page: number
  perPage: number
  encontreiroName: string | null
  encontreiroEquipe: string | null
  encontreiroFicha: string | null
  orderByField: string | null
  orderDirection: string | null
}

type GetTotalEncontreirosSecreProps = {
  encontroId: string
  encontreiroName: string | null
  encontreiroEquipe: string | null
  encontreiroFicha: string | null
}

type EncontreiroType = Awaited<ReturnType<typeof getEncontreirosSecre>>[number]

async function getEncontreirosSecre({
  encontroId,
  page,
  perPage,
  encontreiroName,
  encontreiroEquipe,
  encontreiroFicha,
  orderByField,
  orderDirection,
}: GetEncontreirosSecreProps) {
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

  const encontreiroEquipeFilter: Prisma.DomainEquipesWhereInput =
    encontreiroEquipe && encontreiroEquipe !== 'all'
      ? { equipeValue: encontreiroEquipe }
      : {}

  const encontreiroFichaFilter: Prisma.EquipeEncontroWhereInput =
    encontreiroFicha
      ? encontreiroFicha === 'sim'
        ? { fichaPreenchida: true }
        : { fichaPreenchida: false }
      : {}

  // const orderBy: Prisma.PessoaOrderByWithRelationInput[] = []
  const orderBy: Prisma.EquipeEncontroOrderByWithRelationInput[] = []

  const direction =
    orderDirection === 'asc' || orderDirection === 'desc'
      ? orderDirection
      : 'asc'

  if (orderByField && validOrderFields.includes(orderByField as OrderByField)) {
    const mapping = fieldMappings[orderByField] || {}

    if (orderByField === 'nome') {
      orderBy.push({
        encontreiro: {
          pessoa: {
            nome: direction,
          },
        },
      })
    } else if (mapping.relation) {
      const orderObject = mapping.nestedRelation
        ? {
            [mapping.relation]: {
              [mapping.nestedRelation]: { [orderByField]: direction },
            },
          }
        : { [mapping.relation]: { [orderByField]: direction } }
      orderBy.push(orderObject)
    } else {
      orderBy.push({ [orderByField]: direction })
    }
  } else {
    // Se nada foi especificado, ordena por nome
    orderBy.push({
      encontreiro: {
        pessoa: {
          nome: 'asc',
        },
      },
    })
  }

  return await prisma.equipeEncontro.findMany({
    skip: skipData,
    take: perPage,
    select: {
      fichaPreenchida: true,
      coordenou: true,
      equipe: {
        select: {
          equipeLabel: true,
        },
      },
      encontreiro: {
        select: {
          instagram: true,
          encontro: {
            select: {
              numeroEncontro: true,
            },
          },
          pessoa: {
            select: {
              id: true,
              nome: true,
              sobrenome: true,
              apelido: true,
              celular: true,
              slug: true,
              endereco: {
                select: {
                  bairro: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      idEncontro: encontroId,
      ...encontreiroFichaFilter,
      equipe: {
        ...encontreiroEquipeFilter,
      },
      encontreiro: {
        pessoa: {
          ...nameFilter,
        },
      },
    },
    orderBy,
  })
}

async function getTotalEncontreirosSecre({
  encontroId,
  encontreiroName,
  encontreiroEquipe,
  encontreiroFicha,
}: GetTotalEncontreirosSecreProps) {
  const nameParts = encontreiroName ? encontreiroName.split(' ') : []

  const nameFilter: Prisma.PessoaWhereInput = encontreiroName
    ? {
        OR: nameParts.flatMap((part) => [
          { nome: { contains: part, mode: 'insensitive' } },
          { sobrenome: { contains: part, mode: 'insensitive' } },
        ]),
      }
    : {}

  const encontreiroEquipeFilter: Prisma.DomainEquipesWhereInput =
    encontreiroEquipe && encontreiroEquipe !== 'all'
      ? { equipeValue: encontreiroEquipe }
      : {}

  const encontreiroFichaFilter: Prisma.EquipeEncontroWhereInput =
    encontreiroFicha || encontreiroFicha === 'all'
      ? encontreiroFicha === 'sim'
        ? { fichaPreenchida: true }
        : { fichaPreenchida: false }
      : {}

  return await prisma.equipeEncontro.count({
    where: {
      idEncontro: encontroId,
      ...encontreiroFichaFilter,
      equipe: {
        ...encontreiroEquipeFilter,
      },
      encontreiro: {
        pessoa: {
          ...nameFilter,
        },
      },
    },
  })
}

function transformToEncontreiroSummaryData(
  encontreiros: EncontreiroType[],
): EncontreiroSecreSummaryData[] {
  return encontreiros.map((encontreiro) => {
    return {
      id: encontreiro.encontreiro.pessoa.id,
      nome: encontreiro.encontreiro.pessoa.nome,
      sobrenome: encontreiro.encontreiro.pessoa.sobrenome,
      apelido: encontreiro.encontreiro.pessoa.apelido,
      celular: encontreiro.encontreiro.pessoa.celular,
      bairro: encontreiro.encontreiro.pessoa.endereco.bairro,
      instagram: encontreiro.encontreiro.instagram,
      coordena: encontreiro.coordenou,
      slug: encontreiro.encontreiro.pessoa.slug,
      numeroEncontro: encontreiro.encontreiro.encontro?.numeroEncontro || 0,
      equipe: encontreiro.equipe.equipeLabel,
      fichaPreenchida: encontreiro.fichaPreenchida,
    }
  })
}

export async function getEncontreirosSecreSummary({
  page,
  encontreiroName,
  encontreiroEquipe,
  encontreiroFicha,
  orderByField,
  orderDirection,
}: GetEncontreirosSecreSummaryProps) {
  const encontro = await getCurrentEncontro()
  const perPage = 25

  if (!encontro) return null

  const totalEncontreiro = await getTotalEncontreirosSecre({
    encontroId: encontro.id,
    encontreiroName,
    encontreiroEquipe,
    encontreiroFicha,
  })

  const encontreiros = await getEncontreirosSecre({
    encontroId: encontro.id,
    page,
    perPage,
    encontreiroName,
    encontreiroEquipe,
    encontreiroFicha,
    orderByField,
    orderDirection,
  })

  if (!encontreiros) {
    return null
  }

  const encontreirosResponse = transformToEncontreiroSummaryData(encontreiros)

  const response: EncontreiroSecreSummary = {
    totalCount: totalEncontreiro,
    pageIndex: page + 1,
    perPage,
    encontreiros: encontreirosResponse,
  }

  return response
}
