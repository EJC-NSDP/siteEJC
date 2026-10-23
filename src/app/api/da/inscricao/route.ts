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

  const { idDA, idItem, comoVai, idCarroDA, descricaoItem } =
    (await request.json()) as {
      idDA: string
      idItem: string
      comoVai?: 'DIRIGINDO' | 'CARONA' | 'ONIBUS' | null
      idCarroDA?: string | null
      descricaoItem?: string | null
    }

  const da = await prisma.diaAmizade.findUnique({
    where: { id: idDA },
    select: { aberto: true },
  })

  if (!da)
    return NextResponse.json({ error: 'DA não encontrado.' }, { status: 404 })
  if (!da.aberto)
    return NextResponse.json(
      { error: 'O formulário do DA está fechado.' },
      { status: 403 },
    )

  const jaInscrito = await prisma.inscricaoDA.findUnique({
    where: { idPessoa_idDA: { idPessoa: session.user.id, idDA } },
    select: { idItem: true },
  })

  if (jaInscrito)
    return NextResponse.json(
      { error: 'Você já está inscrito neste DA.' },
      { status: 409 },
    )

  const itemDA = await prisma.itemDA.findUnique({
    where: { idItem_idDA: { idItem, idDA } },
    include: {
      _count: { select: { inscricoes: true } },
      item: { select: { nome: true } },
    },
  })

  if (!itemDA)
    return NextResponse.json(
      { error: 'Item não encontrado neste DA.' },
      { status: 404 },
    )

  if (
    itemDA.quantidade !== null &&
    itemDA._count.inscricoes >= itemDA.quantidade
  )
    return NextResponse.json(
      { error: `"${itemDA.item.nome}" não tem mais vagas disponíveis.` },
      { status: 409 },
    )

  if (comoVai === 'DIRIGINDO' && idCarroDA) {
    const carro = await prisma.carroDA.findUnique({
      where: { id: idCarroDA },
      select: { id: true, idMotorista: true },
    })
    if (!carro)
      return NextResponse.json(
        { error: 'Carro não encontrado.' },
        { status: 404 },
      )
    if (carro.idMotorista !== session.user.id)
      return NextResponse.json(
        { error: 'Este carro não pertence a você.' },
        { status: 403 },
      )
  }

  let idOnibusDA: string | null = null
  if (comoVai === 'ONIBUS') {
    const onibusDisponiveis = await prisma.onibusDA.findMany({
      where: { idDA },
      include: { _count: { select: { passageiros: true } } },
      orderBy: { createdAt: 'asc' },
    })
    const onibus = onibusDisponiveis.find(
      (o) => o.vagas === null || o._count.passageiros < o.vagas,
    )
    if (onibus) idOnibusDA = onibus.id
  }

  const inscricao = await prisma.inscricaoDA.create({
    data: {
      idPessoa: session.user.id,
      idDA,
      idItem,
      comoVai: comoVai ?? null,
      idCarroDA: comoVai === 'DIRIGINDO' ? (idCarroDA ?? null) : null,
      idOnibusDA,
      descricaoItem: descricaoItem ?? null,
    },
    include: {
      itemDA: { include: { item: { select: { nome: true } } } },
      pessoa: { select: { nome: true, sobrenome: true, apelido: true } },
    },
  })

  return NextResponse.json(inscricao, { status: 201 })
}
