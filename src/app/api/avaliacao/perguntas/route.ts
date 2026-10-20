import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const perguntas = await prisma.perguntaAvaliacao.findMany({
    where: { ativo: true },
    orderBy: { ordem: 'asc' },
  })
  return NextResponse.json(perguntas)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { chave, texto, descricao, tipo, categoria } = await request.json()
  if (!chave || !texto || !tipo || !categoria) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const last = await prisma.perguntaAvaliacao.findFirst({ orderBy: { ordem: 'desc' }, select: { ordem: true } })
  const ordem = (last?.ordem ?? 0) + 1

  const pergunta = await prisma.perguntaAvaliacao.create({
    data: {
      chave,
      texto,
      descricao: descricao || null,
      tipo,
      categoria,
      ordem,
      removivel: true,
      ativo: true,
      updatedById: session.user.id,
    },
  })

  return NextResponse.json(pergunta, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id, texto, descricao, ordem, ativo, categoria } = await request.json()

  const pergunta = await prisma.perguntaAvaliacao.update({
    where: { id },
    data: {
      ...(texto !== undefined && { texto }),
      ...(descricao !== undefined && { descricao }),
      ...(ordem !== undefined && { ordem }),
      ...(ativo !== undefined && { ativo }),
      ...(categoria !== undefined && { categoria }),
      updatedById: session.user.id,
    },
  })

  return NextResponse.json(pergunta)
}
