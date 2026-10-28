import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP', 'ENCONTREIRO']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { idDA, idMotorista, force } = (await request.json()) as {
    idDA: string
    idMotorista: string
    force?: boolean
  }

  if (!idDA || !idMotorista)
    return NextResponse.json(
      { error: 'idDA e idMotorista são obrigatórios.' },
      { status: 400 },
    )

  if (idMotorista === session.user.id)
    return NextResponse.json(
      { error: 'Você não pode se convidar.' },
      { status: 400 },
    )

  const da = await prisma.diaAmizade.findUnique({
    where: { id: idDA },
    select: { aberto: true },
  })
  if (!da)
    return NextResponse.json({ error: 'DA não encontrado.' }, { status: 404 })
  if (!da.aberto && !hasRole(session.user.roles, ['ADMIN', 'BP']))
    return NextResponse.json(
      { error: 'O formulário do DA está fechado.' },
      { status: 403 },
    )

  const motorista = await prisma.pessoa.findUnique({
    where: { id: idMotorista },
    select: { nome: true, sobrenome: true, apelido: true },
  })
  if (!motorista)
    return NextResponse.json(
      { error: 'Motorista não encontrado.' },
      { status: 404 },
    )

  // Avisa se o motorista já está inscrito como DIRIGINDO
  const inscricaoMotorista = await prisma.inscricaoDA.findUnique({
    where: { idPessoa_idDA: { idPessoa: idMotorista, idDA } },
    select: { comoVai: true, idCarroDA: true },
  })

  if (inscricaoMotorista?.comoVai === 'DIRIGINDO' && !force) {
    const nome = motorista.apelido ?? `${motorista.nome} ${motorista.sobrenome}`
    return NextResponse.json(
      {
        error: 'MOTORISTA_JA_INSCRITO',
        mensagem: `${nome} já está inscrito como motorista no DA.`,
        nomeMotorista: nome,
      },
      { status: 409 },
    )
  }

  // Impede convite duplicado
  const existingConvite = await prisma.conviteVeiculoDA.findFirst({
    where: {
      idDA,
      idMotorista,
      idConvidado: session.user.id,
      status: { not: 'RECUSADO' },
    },
  })
  if (existingConvite)
    return NextResponse.json(
      {
        error: 'CONVITE_DUPLICADO',
        mensagem: 'Você já enviou um convite para este motorista.',
      },
      { status: 409 },
    )

  // Descobre o carro do motorista neste DA
  const carroMotorista = inscricaoMotorista?.idCarroDA
    ? await prisma.carroDA.findUnique({
        where: { id: inscricaoMotorista.idCarroDA },
        select: { id: true, vagas: true },
      })
    : await prisma.carroDA.findFirst({
        where: { idDA, idMotorista },
        select: { id: true, vagas: true },
      })

  // Verifica capacidade se o carro já existe
  if (carroMotorista) {
    const [passageiroCount, conviteCount] = await Promise.all([
      prisma.inscricaoDA.count({
        where: { idDA, idCarroDA: carroMotorista.id, comoVai: 'CARONA' },
      }),
      prisma.conviteVeiculoDA.count({
        where: {
          idCarroDA: carroMotorista.id,
          status: 'PENDENTE',
        },
      }),
    ])
    if (passageiroCount + conviteCount >= carroMotorista.vagas)
      return NextResponse.json(
        { error: 'O carro deste motorista está cheio.' },
        { status: 409 },
      )
  }

  const convite = await prisma.conviteVeiculoDA.create({
    data: {
      idDA,
      idMotorista,
      idCarroDA: carroMotorista?.id ?? null,
      idConvidado: session.user.id,
      iniciador: 'CARONA',
      status: 'PENDENTE',
    },
  })

  return NextResponse.json(convite, { status: 201 })
}
