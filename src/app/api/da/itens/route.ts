import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

// GET /api/da/itens — lista todos os itens globais com status no DA atual
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const encontro = await prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true },
  })

  const daAtual = encontro
    ? await prisma.diaAmizade.findUnique({
        where: { idEncontro: encontro.id },
        select: { id: true },
      })
    : null

  const itens = await prisma.item.findMany({
    orderBy: { nome: 'asc' },
    include: {
      itensDA: {
        include: {
          _count: { select: { inscricoes: true } },
          da: {
            include: { encontro: { select: { numeroEncontro: true } } },
          },
        },
      },
    },
  })

  const result = itens.map((item) => {
    const emDAAtual = daAtual
      ? item.itensDA.find((i) => i.idDA === daAtual.id)
      : undefined

    const ultimoItemDA = item.itensDA
      .filter((i) => i.idDA !== daAtual?.id)
      .sort(
        (a, b) => b.da.encontro.numeroEncontro - a.da.encontro.numeroEncontro,
      )[0]

    const ultimaQuantidade = ultimoItemDA ? ultimoItemDA.quantidade : 1

    return {
      id: item.id,
      nome: item.nome,
      categoria: item.categoria,
      noDAAtual: !!emDAAtual,
      quantidade: emDAAtual?.quantidade ?? null,
      inscricoesCount: emDAAtual?._count.inscricoes ?? 0,
      ultimaQuantidade,
      ultimoDA: ultimoItemDA
        ? { numeroEncontro: ultimoItemDA.da.encontro.numeroEncontro }
        : null,
    }
  })

  return NextResponse.json(result)
}

// POST /api/da/itens — cria novo item global
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { nome, categoria } = (await request.json()) as {
    nome: string
    categoria: string
  }

  if (!nome?.trim())
    return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
  if (!categoria)
    return NextResponse.json(
      { error: 'Categoria é obrigatória.' },
      { status: 400 },
    )

  const item = await prisma.item.create({
    data: { nome: nome.trim(), categoria: categoria as never },
  })

  return NextResponse.json(item, { status: 201 })
}
