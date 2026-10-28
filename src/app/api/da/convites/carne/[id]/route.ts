import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP', 'ENCONTREIRO']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { status } = (await request.json()) as { status: 'RECUSADO' }

  const convite = await prisma.conviteCarneDA.findUnique({
    where: { id },
    select: { id: true, idConvidado: true, status: true },
  })

  if (!convite || convite.idConvidado !== session.user.id)
    return NextResponse.json(
      { error: 'Convite não encontrado.' },
      { status: 404 },
    )

  if (convite.status !== 'PENDENTE')
    return NextResponse.json(
      { error: 'Este convite não está mais disponível.' },
      { status: 409 },
    )

  await prisma.conviteCarneDA.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json({ success: true })
}
