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
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { modelo, placa, vagas } = (await request.json()) as {
    modelo?: string
    placa?: string
    vagas?: number
  }

  const carro = await prisma.carroDA.update({
    where: { id },
    data: {
      ...(modelo !== undefined && { modelo: modelo || null }),
      ...(placa !== undefined && { placa: placa || null }),
      ...(vagas !== undefined && { vagas }),
    },
  })

  return NextResponse.json(carro)
}

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

  await prisma.$transaction([
    prisma.conviteVeiculoDA.deleteMany({
      where: { idCarroDA: id, status: 'PENDENTE' },
    }),
    prisma.inscricaoDA.updateMany({
      where: { idCarroDA: id },
      data: { idCarroDA: null, comoVai: 'CARONA' },
    }),
    prisma.carroDA.delete({ where: { id } }),
  ])

  return new NextResponse(null, { status: 204 })
}
