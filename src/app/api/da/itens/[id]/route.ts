import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

// PATCH /api/da/itens/[id] — edita o nome do item global
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { nome, categoria } = (await request.json()) as {
    nome?: string
    categoria?: string
  }

  if (nome !== undefined && !nome.trim())
    return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })

  const item = await prisma.item.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome: nome.trim() }),
      ...(categoria !== undefined && { categoria: categoria as never }),
    },
  })

  return NextResponse.json(item)
}

// DELETE /api/da/itens/[id] — deleta item global
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  const inscricoes = await prisma.inscricaoDA.count({ where: { idItem: id } })
  if (inscricoes > 0)
    return NextResponse.json(
      { error: 'Não é possível remover um item que já possui inscritos.' },
      { status: 409 },
    )

  await prisma.item.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
