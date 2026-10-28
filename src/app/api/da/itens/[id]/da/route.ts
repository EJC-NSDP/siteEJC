import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

// POST /api/da/itens/[id]/da — inclui/atualiza item no DA atual
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id: idItem } = await params
  const { idDA, quantidade, pessoasPorUnidade } = (await request.json()) as {
    idDA: string
    quantidade: number | null
    pessoasPorUnidade?: number | null
  }

  if (quantidade !== null && quantidade !== undefined && quantidade < 1)
    return NextResponse.json(
      { error: 'Quantidade mínima é 1.' },
      { status: 400 },
    )

  if (
    pessoasPorUnidade !== null &&
    pessoasPorUnidade !== undefined &&
    pessoasPorUnidade < 1
  )
    return NextResponse.json(
      { error: 'Pessoas por unidade mínimo é 1.' },
      { status: 400 },
    )

  const itemDA = await prisma.itemDA.upsert({
    where: { idItem_idDA: { idItem, idDA } },
    create: {
      idItem,
      idDA,
      quantidade,
      pessoasPorUnidade: pessoasPorUnidade ?? null,
      visivel: true,
    },
    update: {
      quantidade,
      ...(pessoasPorUnidade !== undefined && { pessoasPorUnidade }),
      visivel: true,
    },
  })

  return NextResponse.json(itemDA, { status: 201 })
}

// DELETE /api/da/itens/[id]/da?idDA=... — remove item do DA atual
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id: idItem } = await params
  const { searchParams } = new URL(request.url)
  const idDA = searchParams.get('idDA')

  if (!idDA)
    return NextResponse.json({ error: 'idDA é obrigatório.' }, { status: 400 })

  const inscricoes = await prisma.inscricaoDA.count({
    where: { idItem, idDA },
  })

  if (inscricoes > 0) {
    await prisma.itemDA.update({
      where: { idItem_idDA: { idItem, idDA } },
      data: { visivel: false },
    })
    return new NextResponse(null, { status: 204 })
  }

  await prisma.itemDA.delete({ where: { idItem_idDA: { idItem, idDA } } })

  return new NextResponse(null, { status: 204 })
}
