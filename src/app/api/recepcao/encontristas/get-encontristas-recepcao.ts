import { type Prisma } from '@/generated'
import { prisma } from '@/lib/prisma'

const PER_PAGE = 25

const validOrderFields = ['nome', 'cor'] as const
type OrderByField = (typeof validOrderFields)[number]

const fieldMappings: Record<OrderByField, { path: string[]; field: string }> = {
  nome: { path: [], field: 'nome' },
  cor: { path: ['encontreiro', 'circulo', 'corCirculo'], field: 'cor' },
}

export type EncontristaRecepcaoData = {
  id: string
  nome: string
  sobrenome: string
  apelido: string | null
  corCirculo: string | null
  familiaOk: boolean
  nomeContato1: string
  telContato1: string
  nomeContato2: string | null
  telContato2: string | null
  tiosExterna: string | null
}

export type EncontristaRecepcaoSummary = {
  pageIndex: number
  totalCount: number
  perPage: number
  encontristas: EncontristaRecepcaoData[]
}

function buildNestedOrderBy(
  path: string[],
  field: string,
  direction: 'asc' | 'desc',
): Record<string, unknown> {
  return path.reduceRight(
    (acc, key, index) =>
      index === path.length - 1
        ? { [key]: { [field]: direction } }
        : { [key]: acc },
    {} as Record<string, unknown>,
  )
}

function buildWhere(
  encontreiroName: string | null,
  corCirculo: string | null,
): Prisma.PessoaWhereInput {
  const nameParts = encontreiroName ? encontreiroName.split(' ') : []
  const nameFilter: Prisma.PessoaWhereInput = encontreiroName
    ? {
        OR: nameParts.flatMap((part) => [
          { nome: { contains: part, mode: 'insensitive' } },
          { sobrenome: { contains: part, mode: 'insensitive' } },
        ]),
      }
    : {}

  const colorFilter =
    corCirculo && corCirculo !== 'all'
      ? { encontreiro: { circulo: { corCirculo: { cor: corCirculo } } } }
      : {}

  return {
    ...nameFilter,
    ...colorFilter,
    encontrista: {
      OR: [{ idStatus: 'confirmado' }, { idStatus: 'confirmado_sem_sexta' }],
    },
  }
}

function buildOrderBy(
  orderByField: string | null,
  orderDirection: string | null,
): Prisma.PessoaOrderByWithRelationInput[] {
  const direction =
    orderDirection === 'asc' || orderDirection === 'desc'
      ? orderDirection
      : 'asc'

  if (orderByField && validOrderFields.includes(orderByField as OrderByField)) {
    const mapping = fieldMappings[orderByField as OrderByField]
    if (mapping.path.length) {
      return [
        buildNestedOrderBy(
          mapping.path,
          mapping.field,
          direction,
        ) as Prisma.PessoaOrderByWithRelationInput,
      ]
    }
    return [{ [orderByField]: direction }]
  }

  return [{ nome: 'asc' }]
}

async function queryPessoas(
  where: Prisma.PessoaWhereInput,
  orderBy: Prisma.PessoaOrderByWithRelationInput[],
  skip?: number,
  take?: number,
) {
  return prisma.pessoa.findMany({
    ...(skip !== undefined ? { skip } : {}),
    ...(take !== undefined ? { take } : {}),
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      apelido: true,
      encontreiro: {
        select: {
          circulo: {
            select: { corCirculo: { select: { cor: true } } },
          },
        },
      },
      encontrista: {
        select: {
          familiaOk: true,
          nomeContato1: true,
          telContato1: true,
          nomeContato2: true,
          telContato2: true,
          carroEncontro: {
            select: {
              carro: {
                select: {
                  pessoaMotorista: {
                    select: { nome: true, apelido: true },
                  },
                  pessoaCarona: {
                    select: { nome: true, apelido: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    where,
    orderBy,
  })
}

type RawPessoa = Awaited<ReturnType<typeof queryPessoas>>[number]

function formatTios(
  motorista: { nome: string; apelido: string | null } | null | undefined,
  carona: { nome: string; apelido: string | null } | null | undefined,
): string | null {
  if (!motorista) return null
  const nomeM = motorista.apelido || motorista.nome
  if (!carona) return nomeM
  const nomeC = carona.apelido || carona.nome
  return `${nomeM} e ${nomeC}`
}

function transform(pessoas: RawPessoa[]): EncontristaRecepcaoData[] {
  return pessoas.map((p) => ({
    id: p.id,
    nome: p.nome,
    sobrenome: p.sobrenome,
    apelido: p.apelido,
    corCirculo: p.encontreiro?.circulo?.corCirculo.cor ?? null,
    familiaOk: p.encontrista?.familiaOk ?? false,
    nomeContato1: p.encontrista?.nomeContato1 ?? '',
    telContato1: p.encontrista?.telContato1 ?? '',
    nomeContato2: p.encontrista?.nomeContato2 ?? null,
    telContato2: p.encontrista?.telContato2 ?? null,
    tiosExterna: formatTios(
      p.encontrista?.carroEncontro?.carro.pessoaMotorista,
      p.encontrista?.carroEncontro?.carro.pessoaCarona,
    ),
  }))
}

export async function getEncontristasRecepcaoSummary({
  page,
  encontreiroName,
  corCirculo,
  orderByField,
  orderDirection,
}: {
  page: number
  encontreiroName: string | null
  corCirculo: string | null
  orderByField: string | null
  orderDirection: string | null
}): Promise<EncontristaRecepcaoSummary> {
  const where = buildWhere(encontreiroName, corCirculo)
  const orderBy = buildOrderBy(orderByField, orderDirection)
  const skip = page * PER_PAGE

  const [totalCount, pessoas] = await Promise.all([
    prisma.pessoa.count({ where }),
    queryPessoas(where, orderBy, skip, PER_PAGE),
  ])

  return {
    pageIndex: page,
    totalCount,
    perPage: PER_PAGE,
    encontristas: transform(pessoas),
  }
}

export async function getAllEncontristasRecepcao(): Promise<
  EncontristaRecepcaoData[]
> {
  const where = buildWhere(null, null)
  const orderBy = buildOrderBy('nome', 'asc')
  const pessoas = await queryPessoas(where, orderBy)
  return transform(pessoas)
}
