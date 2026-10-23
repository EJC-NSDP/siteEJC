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

  const onibus = await prisma.onibusDA.findMany({
    where: { idDA },
    include: {
      passageiros: {
        include: {
          pessoa: {
            select: {
              id: true,
              nome: true,
              sobrenome: true,
              apelido: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(onibus)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { idDA, nome, vagas } = (await request.json()) as {
    idDA: string
    nome: string
    vagas?: number | null
  }

  if (!nome?.trim())
    return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })

  const da = await prisma.diaAmizade.findUnique({
    where: { id: idDA },
    select: { id: true },
  })
  if (!da)
    return NextResponse.json({ error: 'DA não encontrado.' }, { status: 404 })

  const onibus = await prisma.onibusDA.create({
    data: { idDA, nome: nome.trim(), vagas: vagas ?? null },
  })

  return NextResponse.json(onibus, { status: 201 })
}
