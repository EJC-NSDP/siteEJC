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

  const carros = await prisma.carroDA.findMany({
    where: { idDA },
    include: {
      motorista: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
          avatarUrl: true,
        },
      },
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

  return NextResponse.json(carros)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP', 'ENCONTREIRO']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { idDA, idMotorista, modelo, placa, vagas } =
    (await request.json()) as {
      idDA: string
      idMotorista?: string
      modelo?: string
      placa?: string
      vagas: number
    }

  if (!vagas || vagas < 1)
    return NextResponse.json(
      { error: 'Vagas deve ser pelo menos 1.' },
      { status: 400 },
    )

  const motoristId =
    hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']) && idMotorista
      ? idMotorista
      : session.user.id

  const da = await prisma.diaAmizade.findUnique({
    where: { id: idDA },
    select: { id: true },
  })
  if (!da)
    return NextResponse.json({ error: 'DA não encontrado.' }, { status: 404 })

  const carro = await prisma.carroDA.create({
    data: {
      idDA,
      idMotorista: motoristId,
      modelo: modelo || null,
      placa: placa || null,
      vagas,
    },
    include: {
      motorista: {
        select: { id: true, nome: true, sobrenome: true, apelido: true },
      },
    },
  })

  return NextResponse.json(carro, { status: 201 })
}
