import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP', 'ENCONTREIRO']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const encontro = await prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true, numeroEncontro: true },
  })

  if (!encontro)
    return NextResponse.json(
      { error: 'Nenhum encontro configurado.' },
      { status: 404 },
    )

  const da = await prisma.diaAmizade.findUnique({
    where: { idEncontro: encontro.id },
    include: {
      itens: {
        orderBy: { createdAt: 'asc' },
        include: {
          item: { select: { nome: true, categoria: true } },
          _count: { select: { inscricoes: true } },
        },
      },
      inscricoes: {
        where: { idPessoa: session.user.id },
        select: {
          idItem: true,
          createdAt: true,
          comoVai: true,
          pagouOnibus: true,
          idCarroDA: true,
          idOnibusDA: true,
          idGrupoCarne: true,
          descricaoItem: true,
          observacao: true,
          carroDa: {
            select: {
              modelo: true,
              placa: true,
              vagas: true,
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
                where: { comoVai: 'CARONA' },
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
          },
          onibusDA: { select: { nome: true } },
          grupoCarne: {
            select: {
              id: true,
              capacidade: true,
              convites: {
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
              membros: {
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
          },
        },
      },
    },
  })

  const pessoaSelect = {
    id: true,
    nome: true,
    sobrenome: true,
    apelido: true,
    avatarUrl: true,
  }

  const [convitesVeiculo, convitesMotorista, convitesCarne] = da
    ? await Promise.all([
        prisma.conviteVeiculoDA.findMany({
          where: {
            idDA: da.id,
            idConvidado: session.user.id,
            status: 'PENDENTE',
          },
          include: {
            motorista: { select: pessoaSelect },
            carroDa: {
              select: { id: true, modelo: true, placa: true, vagas: true },
            },
          },
        }),
        prisma.conviteVeiculoDA.findMany({
          where: {
            idDA: da.id,
            idMotorista: session.user.id,
            iniciador: 'CARONA',
            status: 'PENDENTE',
          },
          include: {
            convidado: { select: pessoaSelect },
          },
        }),
        prisma.conviteCarneDA.findMany({
          where: {
            idConvidado: session.user.id,
            status: 'PENDENTE',
            grupoCarne: { idDA: da.id },
          },
          include: {
            grupoCarne: {
              include: {
                itemDA: {
                  include: {
                    item: { select: { nome: true, categoria: true } },
                  },
                },
                membros: {
                  include: { pessoa: { select: pessoaSelect } },
                  orderBy: { createdAt: 'asc' as const },
                  take: 1,
                },
              },
            },
          },
        }),
      ])
    : [[], [], []]

  const convitesEnviados = da
    ? await prisma.conviteVeiculoDA.findMany({
        where: {
          idDA: da.id,
          idMotorista: session.user.id,
          iniciador: 'MOTORISTA',
          status: { not: 'RECUSADO' },
        },
        include: { convidado: { select: pessoaSelect } },
      })
    : []

  const daAnterior = !da
    ? await prisma.diaAmizade.findFirst({
        where: { idEncontro: { not: encontro.id } },
        orderBy: { createdAt: 'desc' },
        select: { mensagemInicial: true },
      })
    : null

  const carroAnterior = await prisma.carro.findFirst({
    where: { idMotorista: session.user.id },
    select: {
      id: true,
      modeloCarro: true,
      placaCarro: true,
      lugaresCarro: true,
    },
  })

  const pessoa = await prisma.pessoa.findUnique({
    where: { id: session.user.id },
    select: { nome: true, sobrenome: true, celular: true, apelido: true },
  })

  const daMapped = da
    ? {
        ...da,
        itens: da.itens
          .filter((i) => i.visivel)
          .map((i) => ({
            id: i.idItem,
            nome: i.item.nome,
            categoria: i.item.categoria,
            quantidade: i.quantidade,
            pessoasPorUnidade: i.pessoasPorUnidade,
            _count: i._count,
          })),
      }
    : null

  return NextResponse.json({
    encontro,
    da: daMapped,
    mensagemAnterior: daAnterior?.mensagemInicial ?? null,
    carroAnterior: carroAnterior ?? null,
    pessoa: pessoa ?? null,
    convitesVeiculo,
    convitesMotorista,
    convitesCarne,
    convitesEnviados,
  })
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const encontro = await prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true, numeroEncontro: true },
  })

  if (!encontro)
    return NextResponse.json(
      { error: 'Nenhum encontro configurado.' },
      { status: 404 },
    )

  const existing = await prisma.diaAmizade.findUnique({
    where: { idEncontro: encontro.id },
    select: { id: true },
  })

  if (existing)
    return NextResponse.json(
      { error: 'DA já existe para este encontrão.' },
      { status: 409 },
    )

  const da = await prisma.diaAmizade.create({
    data: { idEncontro: encontro.id },
  })

  return NextResponse.json(da, { status: 201 })
}
