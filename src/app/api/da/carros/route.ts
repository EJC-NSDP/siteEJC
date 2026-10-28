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

  const { idDA, idMotorista, modelo, placa, vagas, convidados } =
    (await request.json()) as {
      idDA: string
      idMotorista?: string
      modelo?: string
      placa?: string
      vagas: number
      convidados?: string[]
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

  const carroExistente = await prisma.carroDA.findFirst({
    where: { idDA, idMotorista: motoristId },
  })

  const carro = carroExistente
    ? await prisma.carroDA.update({
        where: { id: carroExistente.id },
        data: {
          modelo: modelo || carroExistente.modelo || null,
          placa: placa || null,
          vagas,
        },
      })
    : await prisma.carroDA.create({
        data: {
          idDA,
          idMotorista: motoristId,
          modelo: modelo || null,
          placa: placa || null,
          vagas,
        },
      })

  // Vincula convites reversos pré-aceitos (carona convidou este motorista antes dele criar o carro)
  const preAceitos = await prisma.conviteVeiculoDA.findMany({
    where: {
      idDA,
      idMotorista: motoristId,
      idCarroDA: null,
      status: 'ACEITO',
      iniciador: 'CARONA',
    },
    select: { id: true, idConvidado: true },
  })

  if (preAceitos.length > 0) {
    await prisma.conviteVeiculoDA.updateMany({
      where: { id: { in: preAceitos.map((c) => c.id) } },
      data: { idCarroDA: carro.id },
    })
    await prisma.inscricaoDA.updateMany({
      where: {
        idDA,
        idPessoa: { in: preAceitos.map((c) => c.idConvidado) },
        idCarroDA: null,
        comoVai: 'CARONA',
      },
      data: { idCarroDA: carro.id },
    })
  }

  // Cria convites para os passageiros convidados pelo motorista
  if (convidados && convidados.length > 0) {
    const novosConvidados = convidados.filter((id) => id !== motoristId)
    if (novosConvidados.length > 0) {
      await prisma.conviteVeiculoDA.createMany({
        data: novosConvidados.map((idConvidado) => ({
          idDA,
          idMotorista: motoristId,
          idCarroDA: carro.id,
          idConvidado,
          iniciador: 'MOTORISTA' as const,
          status: 'PENDENTE' as const,
        })),
      })
    }
  }

  const carroComConvites = await prisma.carroDA.findUnique({
    where: { id: carro.id },
    include: {
      motorista: {
        select: { id: true, nome: true, sobrenome: true, apelido: true },
      },
      convites: {
        where: { status: { not: 'RECUSADO' } },
        include: {
          convidado: {
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
  })

  return NextResponse.json(carroComConvites, { status: 201 })
}
