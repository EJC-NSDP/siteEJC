import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const encontro = await prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { isReceivingAvaliacoes: true },
  })

  return NextResponse.json({
    isReceivingAvaliacoes: encontro?.isReceivingAvaliacoes ?? false,
  })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { isReceivingAvaliacoes } = (await request.json()) as {
    isReceivingAvaliacoes: boolean
  }

  const encontro = await prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true },
  })

  if (!encontro)
    return NextResponse.json(
      { error: 'Nenhum encontro configurado.' },
      { status: 404 },
    )

  await prisma.encontro.update({
    where: { id: encontro.id },
    data: { isReceivingAvaliacoes },
  })

  return NextResponse.json({ isReceivingAvaliacoes })
}
