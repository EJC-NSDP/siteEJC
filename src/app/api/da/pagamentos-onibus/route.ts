import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const idDA = searchParams.get('idDA')
  if (!idDA)
    return NextResponse.json({ error: 'idDA é obrigatório.' }, { status: 400 })

  const pagamentos = await prisma.pagamentoOnibusDA.findMany({
    where: { idDA },
    include: {
      pessoa: { select: { nome: true, sobrenome: true, apelido: true } },
      onibus: { select: { nome: true } },
      usuario: { select: { nome: true, sobrenome: true, apelido: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    pagamentos.map((p) => ({
      id: p.id,
      valor: Number(p.valor),
      createdAt: p.createdAt,
      pessoa: p.pessoa,
      onibus: p.onibus,
      usuario: p.usuario,
    })),
  )
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const idDA = searchParams.get('idDA')
  if (!idDA)
    return NextResponse.json({ error: 'idDA é obrigatório.' }, { status: 400 })

  await prisma.pagamentoOnibusDA.deleteMany({ where: { idDA } })

  return new NextResponse(null, { status: 204 })
}
