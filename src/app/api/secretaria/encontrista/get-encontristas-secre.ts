import { prisma } from '@/lib/prisma'
import { dateToString } from '@/utils/string-to-date'
import { type Prisma } from '@prisma/client'

// Campos válidos para ordenação
export const validOrderFields = ['nome', 'cor'] as const

type OrderByField = (typeof validOrderFields)[number]

// Mapeamento de campos para suas respectivas relações
const fieldMappings: Record<OrderByField, { path: string[]; field: string }> = {
  nome: {
    path: [],
    field: 'nome',
  },
  cor: {
    path: ['encontreiro', 'circulo', 'corCirculo'],
    field: 'cor',
  },
}

export type EncontristaSecreSummaryData = {
  nome: string
  sobrenome: string
  apelido: string | null
  corCirculo: string
  dataNascimento: string
  celular: string
  bairro: string
  instagram: string | null
  slug: string
}

export type EncontristaSecreSummary = {
  pageIndex: number
  totalCount: number
  perPage: number
  encontristas: EncontristaSecreSummaryData[]
}

type GetEncontristasSecreSummaryProps = {
  page: number
  encontreiroName: string | null
  corCirculo: string | null
  orderByField: string | null
  orderDirection: string | null
}

type GetEncontristasSecreProps = {
  page: number
  perPage: number
  encontreiroName: string | null
  corCirculo: string | null
  orderByField: string | null
  orderDirection: string | null
}

type GetTotalEncontristasSecreProps = {
  encontreiroName: string | null
  corCirculo: string | null
}

type EncontristaType = Awaited<ReturnType<typeof getEncontristasSecre>>[number]

function buildNestedOrderBy(
  path: string[],
  field: string,
  direction: 'asc' | 'desc',
): Record<string, unknown> {
  return path.reduceRight(
    (acc, key, index) => {
      if (index === path.length - 1) {
        return { [key]: { [field]: direction } }
      } else {
        return { [key]: acc }
      }
    },
    {} as Record<string, unknown>,
  )
}

async function getEncontristasSecre({
  page,
  perPage,
  encontreiroName,
  corCirculo,
  orderByField,
  orderDirection,
}: GetEncontristasSecreProps) {
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

  const encontristaColorFilter =
    corCirculo && corCirculo !== 'all'
      ? {
          encontreiro: {
            circulo: {
              corCirculo: {
                cor: corCirculo,
              },
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
    const mapping = fieldMappings[orderByField as OrderByField]

    if (mapping?.path?.length) {
      const nestedOrder = buildNestedOrderBy(
        mapping.path,
        mapping.field,
        direction,
      )
      orderBy.push(nestedOrder)
    } else {
      orderBy.push({ [orderByField]: direction })
    }
  } else {
    orderBy.push({
      nome: 'asc',
    })
  }

  return await prisma.pessoa.findMany({
    skip: skipData,
    take: perPage,
    select: {
      nome: true,
      sobrenome: true,
      apelido: true,
      celular: true,
      slug: true,
      endereco: {
        select: {
          cep: true,
          bairro: true,
        },
      },
      encontreiro: {
        select: {
          dataNasc: true,
          instagram: true,
          circulo: {
            select: {
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
      ...nameFilter,
      ...encontristaColorFilter,
      encontrista: {
        OR: [{ idStatus: 'confirmado' }, { idStatus: 'confirmado_sem_sexta' }],
      },
    },
    orderBy,
  })
}

async function getTotalEncontristasSecre({
  encontreiroName,
  corCirculo,
}: GetTotalEncontristasSecreProps) {
  const nameParts = encontreiroName ? encontreiroName.split(' ') : []

  const nameFilter: Prisma.PessoaWhereInput = encontreiroName
    ? {
        OR: nameParts.flatMap((part) => [
          { nome: { contains: part, mode: 'insensitive' } },
          { sobrenome: { contains: part, mode: 'insensitive' } },
        ]),
      }
    : {}

  const encontristaColorFilter =
    corCirculo && corCirculo !== 'all'
      ? {
          encontreiro: {
            circulo: {
              corCirculo: {
                cor: corCirculo,
              },
            },
          },
        }
      : {}

  return await prisma.pessoa.count({
    where: {
      ...nameFilter,
      ...encontristaColorFilter,
      encontrista: {
        OR: [{ idStatus: 'confirmado' }, { idStatus: 'confirmado_sem_sexta' }],
      },
    },
  })
}

function transformToEncontristasSummaryData(
  encontristas: EncontristaType[],
): EncontristaSecreSummaryData[] {
  return encontristas.map((encontrista) => {
    return {
      nome: encontrista.nome,
      sobrenome: encontrista.sobrenome,
      apelido: encontrista.apelido,
      celular: encontrista.celular,
      bairro: encontrista.endereco.bairro,
      instagram: encontrista.encontreiro!.instagram || '',
      slug: encontrista.slug,
      corCirculo:
        encontrista.encontreiro!.circulo?.corCirculo.cor || 'Não alocado',
      dataNascimento: dateToString(encontrista.encontreiro!.dataNasc),
    }
  })
}

export async function getEncontristasSecreSummary({
  page,
  encontreiroName,
  corCirculo,
  orderByField,
  orderDirection,
}: GetEncontristasSecreSummaryProps) {
  const perPage = 25

  const totalEncontrista = await getTotalEncontristasSecre({
    encontreiroName,
    corCirculo,
  })

  const encontrista = await getEncontristasSecre({
    page,
    perPage,
    encontreiroName,
    corCirculo,
    orderByField,
    orderDirection,
  })

  if (!encontrista) {
    return null
  }

  const encontristaResponse = transformToEncontristasSummaryData(encontrista)

  const response: EncontristaSecreSummary = {
    totalCount: totalEncontrista,
    pageIndex: page + 1,
    perPage,
    encontristas: encontristaResponse,
  }

  return response
}
