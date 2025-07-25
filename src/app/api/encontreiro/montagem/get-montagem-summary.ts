// eslint-disable-next-line prettier/prettier
import { prisma } from '@/lib/prisma';
// eslint-disable-next-line prettier/prettier
import type { Prisma } from '@prisma/client';

// Campos válidos para ordenação
export const validOrderFields = [
  'numeroEncontro',
  'nome',
  'bairro',
  'equipe',
  'disponibilidade',
] as const

// Mapeamento de campos para suas respectivas relações
const fieldMappings: Record<
  string,
  { relation?: string; nestedRelation?: string; targetField?: string }
> = {
  bairro: { relation: 'endereco' },
  disponibilidade: {
    relation: 'encontreiro',
    nestedRelation: 'disponibilidade',
  },
  numeroEncontro: { relation: 'encontreiro', nestedRelation: 'encontro' },
  equipe: {
    relation: 'encontreiro',
    nestedRelation: 'equipeMontagem',
    targetField: 'equipe',
  },
}

type OrderByField = (typeof validOrderFields)[number]

export interface EncontreiroMontagemSummaryData {
  id: string
  slug: string
  avatarUrl: string | null
  nome: string
  encontro: string
  bairro: string
  disponibilidade: string
  preferencias: string[]
  equipe: {
    value: string
    coordenando: boolean
  } | null
}

export type EncontreiroMontagemSummary = {
  pageIndex: number
  totalCount: number
  perPage: number
  encontreiros: EncontreiroMontagemSummaryData[]
}

type GetEncontreirosMontagemSummaryProps = {
  page: number
  encontreiroName: string | null
  equipeValue: string | null
  preferenciaValue: string | null
  orderByField: string | null
  orderDirection: string | null
}

type GetEncontreirosMontagemProps = {
  page: number
  perPage: number
  encontreiroName: string | null
  equipeValue: string | null
  preferenciaValue: string | null
  orderByField: string | null
  orderDirection: string | null
}

type GetTotalEncontreirosMontagemProps = {
  encontreiroName: string | null
  equipeValue: string | null
  preferenciaValue: string | null
}

const pessoaSelect = {
  id: true,
  avatarUrl: true,
  nome: true,
  sobrenome: true,
  slug: true,
  endereco: {
    select: {
      bairro: true,
    },
  },
  encontreiro: {
    select: {
      disponibilidade: {
        select: {
          disponibilidade: true,
        },
      },
      listaPreferencias: {
        select: {
          posicao: true,
          equipe: {
            select: {
              equipeLabel: true,
            },
          },
        },
      },
      equipeMontagem: {
        select: {
          valueEquipe: true,
          coordenando: true,
        },
      },
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
} satisfies Prisma.PessoaSelect

type PessoaComRelacionamentos = Prisma.PessoaGetPayload<{
  select: typeof pessoaSelect
}>

async function getEncontreirosMontagem({
  page,
  perPage,
  encontreiroName,
  equipeValue,
  preferenciaValue,
  orderByField,
  orderDirection,
}: GetEncontreirosMontagemProps): Promise<PessoaComRelacionamentos[]> {
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

  const equipeFilter: Prisma.EncontreiroWhereInput =
    equipeValue && equipeValue === 'sem_equipe'
      ? { equipeMontagem: null }
      : equipeValue && equipeValue !== 'all_equipes'
        ? { equipeMontagem: { valueEquipe: equipeValue } }
        : {}

  const preferenciaFilter: Prisma.EncontreiroWhereInput =
    preferenciaValue && preferenciaValue !== 'all_equipes'
      ? {
          listaPreferencias: {
            some: {
              valueEquipe: preferenciaValue,
            },
          },
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
      orderBy.push({ nome: direction }, { sobrenome: direction })
    } else if (
      mapping.relation &&
      mapping.nestedRelation &&
      mapping.targetField
    ) {
      orderBy.push({
        [mapping.relation]: {
          [mapping.nestedRelation]: {
            [mapping.targetField]: {
              equipeLabel: direction,
            },
          },
        },
      })
    } else if (mapping.relation && mapping.nestedRelation) {
      orderBy.push({
        [mapping.relation]: {
          [mapping.nestedRelation]: { [orderByField]: direction },
        },
      })
    } else if (mapping.relation) {
      orderBy.push({ [mapping.relation]: { [orderByField]: direction } })
    } else {
      orderBy.push({ [orderByField]: direction })
    }
  } else {
    // Ordem padrão: por nome e sobrenome
    orderBy.push({ nome: 'asc' }, { sobrenome: 'asc' })
  }

  return await prisma.pessoa.findMany({
    skip: skipData,
    take: perPage,
    select: pessoaSelect,
    where: {
      role: {
        notIn: ['ENCONTRISTA', 'DIRIGENTE', 'TIOEXTERNA'],
      },
      ...nameFilter,
      encontreiro: {
        NOT: { statusMontagem: 'INATIVO' },
        ...equipeFilter,
        ...preferenciaFilter,
      },
    },
    orderBy,
  })
}

async function getTotalMontagem({
  encontreiroName,
  equipeValue,
  preferenciaValue,
}: GetTotalEncontreirosMontagemProps) {
  const nameParts = encontreiroName ? encontreiroName.split(' ') : []

  const nameFilter: Prisma.PessoaWhereInput = encontreiroName
    ? {
        OR: nameParts.flatMap((part) => [
          { nome: { contains: part, mode: 'insensitive' } },
          { sobrenome: { contains: part, mode: 'insensitive' } },
        ]),
      }
    : {}

  const equipeFilter: Prisma.EncontreiroWhereInput =
    equipeValue && equipeValue === 'sem_equipe'
      ? { equipeMontagem: null }
      : equipeValue && equipeValue !== 'all_equipes'
        ? { equipeMontagem: { valueEquipe: equipeValue } }
        : {}

  const preferenciaFilter: Prisma.EncontreiroWhereInput =
    preferenciaValue && preferenciaValue !== 'all_equipes'
      ? {
          listaPreferencias: {
            some: {
              valueEquipe: preferenciaValue,
            },
          },
        }
      : {}

  return await prisma.pessoa.count({
    where: {
      role: {
        notIn: ['ENCONTRISTA', 'DIRIGENTE', 'TIOEXTERNA'],
      },
      ...nameFilter,
      encontreiro: {
        NOT: { statusMontagem: 'INATIVO' },
        ...preferenciaFilter,
        ...equipeFilter,
      },
    },
  })
}

function comparePosicao(
  a: {
    posicao: number
    equipe: {
      equipeLabel: string
    }
  },
  b: {
    posicao: number
    equipe: {
      equipeLabel: string
    }
  },
) {
  if (a.posicao < b.posicao) {
    return -1
  }
  if (a.posicao > b.posicao) {
    return 1
  }
  return 0
}

function transformToEncontreiroSummaryData(
  encontreiros: PessoaComRelacionamentos[],
): EncontreiroMontagemSummaryData[] {
  return encontreiros.map((encontreiro) => {
    const listaPreferencias = encontreiro.encontreiro
      ? encontreiro.encontreiro.listaPreferencias.sort(comparePosicao)
      : []
    return {
      id: encontreiro.id,
      slug: encontreiro.slug,
      avatarUrl: encontreiro.avatarUrl,
      nome: `${encontreiro.nome} ${encontreiro.sobrenome}`,
      encontro:
        encontreiro.encontreiro?.encontro?.numeroEncontro?.toString() ?? '',
      bairro: encontreiro.endereco?.bairro ?? 'N/A',
      disponibilidade:
        encontreiro.encontreiro?.disponibilidade?.disponibilidade ?? '',
      preferencias: listaPreferencias.map(
        (p) => `${p.posicao}ª - ${p.equipe.equipeLabel}`,
      ),
      equipe: encontreiro.encontreiro?.equipeMontagem
        ? {
            value: encontreiro.encontreiro.equipeMontagem.valueEquipe,
            coordenando: encontreiro.encontreiro.equipeMontagem.coordenando,
          }
        : null,
    }
  })
}

export async function getEncontreirosSummary({
  page,
  encontreiroName,
  equipeValue,
  orderByField,
  orderDirection,
  preferenciaValue,
}: GetEncontreirosMontagemSummaryProps) {
  const perPage = 25

  const totalEncontreiro = await getTotalMontagem({
    encontreiroName,
    equipeValue,
    preferenciaValue,
  })

  const encontreiros = await getEncontreirosMontagem({
    page,
    perPage,
    encontreiroName,
    equipeValue,
    orderByField,
    orderDirection,
    preferenciaValue,
  })

  if (!encontreiros) {
    return null
  }

  const encontreirosResponse = transformToEncontreiroSummaryData(encontreiros)

  const response: EncontreiroMontagemSummary = {
    totalCount: totalEncontreiro,
    pageIndex: page + 1,
    perPage,
    encontreiros: encontreirosResponse,
  }

  return response
}
