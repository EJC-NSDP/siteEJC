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
    corrigirValorPago?: boolean
    idResponsavelBP?: string | null
    descricaoItem?: string | null
    observacao?: string | null
    devolverPagamento?: boolean
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
  if (body.idOnibusDA !== undefined) {
    updateData.idOnibusDA = body.idOnibusDA
    if (body.idOnibusDA !== null) {
      const inscricaoAtual = await prisma.inscricaoDA.findUnique({
        where: { idPessoa_idDA: { idPessoa, idDA } },
        select: {
          pagouOnibus: true,
          valorPago: true,
          idOnibusDA: true,
          pendentePagamento: true,
          idOnibusDAAnterior: true,
          valorPagoAnterior: true,
        },
      })
      if (
        (inscricaoAtual?.pagouOnibus || inscricaoAtual?.pendentePagamento) &&
        inscricaoAtual.idOnibusDA !== body.idOnibusDA
      ) {
        if (body.idOnibusDA === inscricaoAtual.idOnibusDAAnterior) {
          // Returning to the original paid ônibus — restore paid state, no log
          updateData.pagouOnibus = true
          updateData.valorPago =
            inscricaoAtual.valorPagoAnterior ?? inscricaoAtual.valorPago
          updateData.pendentePagamento = false
          updateData.idOnibusDAAnterior = null
          updateData.valorPagoAnterior = null
        } else {
          // Moving to a different ônibus — set pendente, no log yet
          if (!inscricaoAtual.pendentePagamento) {
            // Prefer already-stored anterior (e.g. when coming from sem-veículo)
            updateData.idOnibusDAAnterior =
              inscricaoAtual.idOnibusDAAnterior ?? inscricaoAtual.idOnibusDA
            updateData.valorPagoAnterior =
              inscricaoAtual.valorPagoAnterior ?? inscricaoAtual.valorPago
          }
          updateData.pagouOnibus = false
          updateData.valorPago = null
          updateData.pendentePagamento = true
        }
      }
    } else {
      // Moving out of an ônibus — save reference for potential devolução
      const inscricaoAtual = await prisma.inscricaoDA.findUnique({
        where: { idPessoa_idDA: { idPessoa, idDA } },
        select: { pagouOnibus: true, valorPago: true, idOnibusDA: true },
      })
      if (inscricaoAtual?.pagouOnibus && inscricaoAtual.idOnibusDA) {
        updateData.idOnibusDAAnterior = inscricaoAtual.idOnibusDA
        updateData.valorPagoAnterior = inscricaoAtual.valorPago
      }
    }
  }
  if (body.idResponsavelBP !== undefined)
    updateData.idResponsavelBP = body.idResponsavelBP
  if (body.descricaoItem !== undefined)
    updateData.descricaoItem = body.descricaoItem
  if (body.observacao !== undefined)
    updateData.observacao = body.observacao?.trim() || null

  // Pagamento: marcar como pago/não pago
  if (body.pagouOnibus !== undefined) {
    updateData.pagouOnibus = body.pagouOnibus
    if (body.pagouOnibus) {
      const inscricaoAtual = await prisma.inscricaoDA.findUnique({
        where: { idPessoa_idDA: { idPessoa, idDA } },
        select: {
          idOnibusDA: true,
          valorPago: true,
          pendentePagamento: true,
          idOnibusDAAnterior: true,
          valorPagoAnterior: true,
        },
      })
      if (inscricaoAtual?.idOnibusDA) {
        const onibus = await prisma.onibusDA.findUnique({
          where: { id: inscricaoAtual.idOnibusDA },
          select: { valorPorPessoa: true },
        })
        if (onibus) {
          updateData.valorPago = onibus.valorPorPessoa
          updateData.pendentePagamento = false
          updateData.idOnibusDAAnterior = null
          updateData.valorPagoAnterior = null

          if (
            inscricaoAtual.pendentePagamento &&
            inscricaoAtual.idOnibusDAAnterior
          ) {
            // Moved from another ônibus: log reversal on old + payment on new
            await prisma.pagamentoOnibusDA.createMany({
              data: [
                {
                  idDA,
                  idPessoa,
                  idOnibusDA: inscricaoAtual.idOnibusDAAnterior,
                  valor: -Number(inscricaoAtual.valorPagoAnterior ?? 0),
                  idUsuario: session.user.id,
                },
                {
                  idDA,
                  idPessoa,
                  idOnibusDA: inscricaoAtual.idOnibusDA,
                  valor: Number(onibus.valorPorPessoa),
                  idUsuario: session.user.id,
                },
              ],
            })
          } else {
            // Normal first payment: log delta
            const delta =
              Number(onibus.valorPorPessoa) -
              Number(inscricaoAtual.valorPago ?? 0)
            await prisma.pagamentoOnibusDA.create({
              data: {
                idDA,
                idPessoa,
                idOnibusDA: inscricaoAtual.idOnibusDA,
                valor: delta,
                idUsuario: session.user.id,
              },
            })
          }
        }
      }
    } else {
      // Unmark: log a negative entry to cancel the previous payment
      const inscricaoAtual = await prisma.inscricaoDA.findUnique({
        where: { idPessoa_idDA: { idPessoa, idDA } },
        select: { idOnibusDA: true, valorPago: true },
      })
      if (inscricaoAtual?.valorPago != null && inscricaoAtual.idOnibusDA) {
        await prisma.pagamentoOnibusDA.create({
          data: {
            idDA,
            idPessoa,
            idOnibusDA: inscricaoAtual.idOnibusDA,
            valor: -Number(inscricaoAtual.valorPago),
            idUsuario: session.user.id,
          },
        })
      }
      updateData.valorPago = null
      updateData.pendentePagamento = false
      updateData.idOnibusDAAnterior = null
      updateData.valorPagoAnterior = null
    }
  }

  // Devolução: pessoa saiu do ônibus, BP confirma que devolveu o dinheiro
  if (body.devolverPagamento) {
    const inscricaoAtual = await prisma.inscricaoDA.findUnique({
      where: { idPessoa_idDA: { idPessoa, idDA } },
      select: { idOnibusDAAnterior: true, valorPago: true },
    })
    if (inscricaoAtual?.idOnibusDAAnterior && inscricaoAtual.valorPago != null) {
      await prisma.pagamentoOnibusDA.create({
        data: {
          idDA,
          idPessoa,
          idOnibusDA: inscricaoAtual.idOnibusDAAnterior,
          valor: -Number(inscricaoAtual.valorPago),
          idUsuario: session.user.id,
        },
      })
    }
    updateData.pagouOnibus = false
    updateData.valorPago = null
    updateData.pendentePagamento = false
    updateData.idOnibusDAAnterior = null
    updateData.valorPagoAnterior = null
  }

  // Correção: log a diferença entre o novo valor e o valor já pago
  if (body.corrigirValorPago) {
    const inscricaoAtual = await prisma.inscricaoDA.findUnique({
      where: { idPessoa_idDA: { idPessoa, idDA } },
      select: { idOnibusDA: true, valorPago: true },
    })
    if (inscricaoAtual?.idOnibusDA) {
      const onibus = await prisma.onibusDA.findUnique({
        where: { id: inscricaoAtual.idOnibusDA },
        select: { valorPorPessoa: true },
      })
      if (onibus) {
        const diferenca =
          Number(onibus.valorPorPessoa) - Number(inscricaoAtual.valorPago ?? 0)
        updateData.valorPago = onibus.valorPorPessoa
        await prisma.pagamentoOnibusDA.create({
          data: {
            idDA,
            idPessoa,
            idOnibusDA: inscricaoAtual.idOnibusDA,
            valor: diferenca,
            idUsuario: session.user.id,
          },
        })
      }
    }
  }

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
