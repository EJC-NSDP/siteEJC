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

  const {
    idDA,
    idItem: idItemBody,
    comoVai,
    idCarroDA: idCarroDABody,
    descricaoItem,
    observacao,
    aceitarConviteVeiculoId,
    convidadosCarne,
    aceitarConviteCarneId,
  } = (await request.json()) as {
    idDA: string
    idItem?: string
    comoVai?: 'DIRIGINDO' | 'CARONA' | 'ONIBUS' | null
    idCarroDA?: string | null
    descricaoItem?: string | null
    observacao?: string | null
    aceitarConviteVeiculoId?: string
    convidadosCarne?: string[]
    aceitarConviteCarneId?: string
  }

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

  const jaInscrito = await prisma.inscricaoDA.findUnique({
    where: { idPessoa_idDA: { idPessoa: session.user.id, idDA } },
    select: { idItem: true },
  })

  if (jaInscrito)
    return NextResponse.json(
      { error: 'Você já está inscrito neste DA.' },
      { status: 409 },
    )

  let idItem = idItemBody ?? null
  let idCarroDA = idCarroDABody ?? null
  let idGrupoCarne: string | null = null

  // Aceitando convite de veículo — obtém o idCarroDA do convite
  if (aceitarConviteVeiculoId) {
    const conviteVeiculo = await prisma.conviteVeiculoDA.findUnique({
      where: { id: aceitarConviteVeiculoId },
      include: { carroDa: { select: { id: true, vagas: true } } },
    })
    if (!conviteVeiculo || conviteVeiculo.idConvidado !== session.user.id)
      return NextResponse.json(
        { error: 'Convite de veículo inválido.' },
        { status: 400 },
      )
    if (!['PENDENTE', 'ACEITO'].includes(conviteVeiculo.status))
      return NextResponse.json(
        { error: 'Este convite não está mais disponível.' },
        { status: 409 },
      )
    if (conviteVeiculo.idCarroDA && conviteVeiculo.carroDa) {
      const [passageiroCount, conviteCount] = await Promise.all([
        prisma.inscricaoDA.count({
          where: { idDA, idCarroDA: conviteVeiculo.idCarroDA, comoVai: 'CARONA' },
        }),
        prisma.conviteVeiculoDA.count({
          where: {
            idCarroDA: conviteVeiculo.idCarroDA,
            status: 'PENDENTE',
            id: { not: aceitarConviteVeiculoId },
          },
        }),
      ])
      if (passageiroCount + conviteCount >= conviteVeiculo.carroDa.vagas)
        return NextResponse.json(
          { error: 'O carro está cheio.' },
          { status: 409 },
        )
      idCarroDA = conviteVeiculo.idCarroDA
    }
  }

  // Aceitando convite de carne — obtém idItem e idGrupoCarne do grupo
  if (aceitarConviteCarneId) {
    const conviteCarne = await prisma.conviteCarneDA.findUnique({
      where: { id: aceitarConviteCarneId },
      include: {
        grupoCarne: {
          select: {
            id: true,
            idItem: true,
            capacidade: true,
            _count: { select: { membros: true } },
          },
        },
      },
    })
    if (!conviteCarne || conviteCarne.idConvidado !== session.user.id)
      return NextResponse.json(
        { error: 'Convite de carne inválido.' },
        { status: 400 },
      )
    if (conviteCarne.status !== 'PENDENTE')
      return NextResponse.json(
        { error: 'Este convite não está mais disponível.' },
        { status: 409 },
      )
    if (conviteCarne.grupoCarne._count.membros >= conviteCarne.grupoCarne.capacidade)
      return NextResponse.json(
        { error: 'O grupo de carne está cheio.' },
        { status: 409 },
      )
    idItem = conviteCarne.grupoCarne.idItem
    idGrupoCarne = conviteCarne.grupoCarne.id
  }

  if (!idItem)
    return NextResponse.json({ error: 'Item é obrigatório.' }, { status: 400 })

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

  if (!itemDA.visivel)
    return NextResponse.json(
      { error: 'Este item não está disponível para inscrição.' },
      { status: 409 },
    )

  // Verificação de quantidade: aceitar convite de carne não consome nova unidade
  if (!aceitarConviteCarneId && itemDA.quantidade !== null) {
    if (itemDA.pessoasPorUnidade && itemDA.pessoasPorUnidade > 1) {
      const gruposCount = await prisma.grupoCarneDA.count({
        where: { idDA, idItem },
      })
      if (gruposCount >= itemDA.quantidade)
        return NextResponse.json(
          {
            error: `"${itemDA.item.nome}" não tem mais vagas disponíveis.`,
          },
          { status: 409 },
        )
    } else if (itemDA._count.inscricoes >= itemDA.quantidade) {
      return NextResponse.json(
        { error: `"${itemDA.item.nome}" não tem mais vagas disponíveis.` },
        { status: 409 },
      )
    }
  }

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

  // Cria grupo de carne se o motorista/carona está convidando pessoas (antes da inscrição)
  if (convidadosCarne && convidadosCarne.length > 0 && !aceitarConviteCarneId) {
    if (itemDA.pessoasPorUnidade && itemDA.pessoasPorUnidade > 1) {
      const grupo = await prisma.grupoCarneDA.create({
        data: { idDA, idItem, capacidade: itemDA.pessoasPorUnidade },
      })
      idGrupoCarne = grupo.id
    }
  }

  const inscricao = await prisma.inscricaoDA.create({
    data: {
      idPessoa: session.user.id,
      idDA,
      idItem,
      comoVai: comoVai ?? null,
      idCarroDA: comoVai === 'DIRIGINDO' ? (idCarroDA ?? null) : idCarroDA,
      idOnibusDA,
      descricaoItem: descricaoItem ?? null,
      observacao: observacao?.trim() || null,
      idGrupoCarne,
      idResponsavelBP: hasRole(session.user.roles, 'BP') ? session.user.id : null,
    },
    include: {
      itemDA: { include: { item: { select: { nome: true } } } },
      pessoa: { select: { nome: true, sobrenome: true, apelido: true } },
    },
  })

  // Marca convite de veículo como aceito
  if (aceitarConviteVeiculoId) {
    await prisma.conviteVeiculoDA.update({
      where: { id: aceitarConviteVeiculoId },
      data: { status: 'ACEITO' },
    })
  }

  // Marca convite de carne como aceito
  if (aceitarConviteCarneId) {
    await prisma.conviteCarneDA.update({
      where: { id: aceitarConviteCarneId },
      data: { status: 'ACEITO' },
    })
  }

  // Cria convites de carne para os convidados
  if (idGrupoCarne && convidadosCarne && convidadosCarne.length > 0 && !aceitarConviteCarneId) {
    const maxConvites = (itemDA.pessoasPorUnidade ?? 1) - 1
    const convidadosFiltrados = convidadosCarne
      .filter((id) => id !== session.user.id)
      .slice(0, maxConvites)
    if (convidadosFiltrados.length > 0) {
      await prisma.conviteCarneDA.createMany({
        data: convidadosFiltrados.map((idConvidado) => ({
          idGrupoCarne,
          idConvidado,
          status: 'PENDENTE' as const,
        })),
      })
    }
  }

  // Se carona enviou convite para motorista, cria carro placeholder se necessário
  if (comoVai === 'CARONA' && !aceitarConviteVeiculoId) {
    const conviteEnviado = await prisma.conviteVeiculoDA.findFirst({
      where: {
        idDA,
        idConvidado: session.user.id,
        iniciador: 'CARONA',
        status: { not: 'RECUSADO' },
      },
      include: {
        motorista: { select: { nome: true, sobrenome: true, apelido: true } },
      },
    })

    if (conviteEnviado) {
      let idCarroParaCarona = conviteEnviado.idCarroDA

      if (!idCarroParaCarona) {
        const nomeMotorista =
          conviteEnviado.motorista.apelido ??
          `${conviteEnviado.motorista.nome} ${conviteEnviado.motorista.sobrenome}`

        const carroExistente = await prisma.carroDA.findFirst({
          where: { idDA, idMotorista: conviteEnviado.idMotorista },
          select: { id: true },
        })

        let idCarro = carroExistente?.id
        if (!idCarro) {
          const novoCarro = await prisma.carroDA.create({
            data: {
              idDA,
              idMotorista: conviteEnviado.idMotorista,
              modelo: nomeMotorista,
              placa: null,
              vagas: 5,
            },
          })
          idCarro = novoCarro.id
        }

        await prisma.conviteVeiculoDA.update({
          where: { id: conviteEnviado.id },
          data: { idCarroDA: idCarro },
        })
        idCarroParaCarona = idCarro
      }

      await prisma.inscricaoDA.update({
        where: { idPessoa_idDA: { idPessoa: session.user.id, idDA } },
        data: { idCarroDA: idCarroParaCarona },
      })
    }
  }

  return NextResponse.json(inscricao, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const idPessoa = searchParams.get('idPessoa')
  const idDA = searchParams.get('idDA')

  if (!idPessoa || !idDA)
    return NextResponse.json(
      { error: 'idPessoa e idDA são obrigatórios.' },
      { status: 400 },
    )

  await prisma.conviteVeiculoDA.deleteMany({
    where: { idDA, idConvidado: idPessoa },
  })

  await prisma.conviteCarneDA.deleteMany({
    where: { idConvidado: idPessoa, grupoCarne: { idDA } },
  })

  await prisma.inscricaoDA.deleteMany({
    where: { idDA, idPessoa },
  })

  return NextResponse.json({ success: true })
}
