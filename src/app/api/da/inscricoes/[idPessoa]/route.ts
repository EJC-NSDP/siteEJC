import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idPessoa: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { idPessoa } = await params
  const body = (await request.json()) as {
    idDA: string
    idItem?: string
    comoVai?: 'DIRIGINDO' | 'CARONA' | 'ONIBUS' | null
    idCarroDA?: string | null
    idOnibusDA?: string | null
    pagouOnibus?: boolean
    idResponsavelBP?: string | null
    descricaoItem?: string | null
    observacao?: string | null
  }
  const { idDA } = body

  const updateData: Record<string, unknown> = {}

  if (body.idItem !== undefined) {
    const { idItem } = body
    const itemDA = await prisma.itemDA.findUnique({
      where: { idItem_idDA: { idItem: idItem!, idDA } },
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

    const inscricaoAtual = await prisma.inscricaoDA.findUnique({
      where: { idPessoa_idDA: { idPessoa, idDA } },
      select: { idItem: true },
    })

    if (
      inscricaoAtual?.idItem !== idItem &&
      itemDA.quantidade !== null &&
      itemDA._count.inscricoes >= itemDA.quantidade
    )
      return NextResponse.json(
        { error: `"${itemDA.item.nome}" não tem mais vagas disponíveis.` },
        { status: 409 },
      )

    updateData.idItem = idItem
  }

  if (body.comoVai !== undefined) updateData.comoVai = body.comoVai
  if (body.idCarroDA !== undefined) updateData.idCarroDA = body.idCarroDA
  if (body.idOnibusDA !== undefined) updateData.idOnibusDA = body.idOnibusDA
  if (body.pagouOnibus !== undefined) updateData.pagouOnibus = body.pagouOnibus
  if (body.idResponsavelBP !== undefined)
    updateData.idResponsavelBP = body.idResponsavelBP
  if (body.descricaoItem !== undefined)
    updateData.descricaoItem = body.descricaoItem
  if (body.observacao !== undefined)
    updateData.observacao = body.observacao?.trim() || null

  const inscricao = await prisma.inscricaoDA.update({
    where: { idPessoa_idDA: { idPessoa, idDA } },
    data: updateData,
    include: {
      itemDA: { include: { item: { select: { nome: true } } } },
      pessoa: {
        select: { id: true, nome: true, sobrenome: true, apelido: true },
      },
    },
  })

  return NextResponse.json(inscricao)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ idPessoa: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { idPessoa } = await params
  const { searchParams } = new URL(request.url)
  const idDA = searchParams.get('idDA')

  if (!idDA)
    return NextResponse.json({ error: 'idDA é obrigatório.' }, { status: 400 })

  const carroDaMotorista = await prisma.carroDA.findFirst({
    where: { idDA, idMotorista: idPessoa },
  })

  await prisma.$transaction(async (tx) => {
    await tx.conviteVeiculoDA.deleteMany({
      where: {
        idDA,
        OR: [{ idConvidado: idPessoa }, { idMotorista: idPessoa }],
      },
    })
    await tx.conviteCarneDA.deleteMany({
      where: { idConvidado: idPessoa, grupoCarne: { idDA } },
    })
    if (carroDaMotorista) {
      await tx.inscricaoDA.updateMany({
        where: { idCarroDA: carroDaMotorista.id },
        data: { idCarroDA: null },
      })
      await tx.carroDA.delete({ where: { id: carroDaMotorista.id } })
    }
    await tx.inscricaoDA.delete({
      where: { idPessoa_idDA: { idPessoa, idDA } },
    })
  })

  return new NextResponse(null, { status: 204 })
}
