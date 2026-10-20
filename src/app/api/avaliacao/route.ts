import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const idEncontro = searchParams.get('idEncontro')

  const encontro = idEncontro
    ? { id: idEncontro }
    : await prisma.encontro.findFirst({ orderBy: { numeroEncontro: 'desc' }, select: { id: true } })

  if (!encontro) return NextResponse.json([])

  const avaliacoes = await prisma.avaliacaoEncontro.findMany({
    where: { idEncontro: encontro.id },
    include: {
      autor: {
        select: { id: true, nome: true, sobrenome: true, apelido: true, avatarUrl: true },
      },
      respostas: {
        include: { pergunta: { select: { chave: true, texto: true, tipo: true, ordem: true } } },
        orderBy: { pergunta: { ordem: 'asc' } },
      },
      indicacoes: {
        include: {
          encontreiro: {
            select: {
              idPessoa: true,
              pessoa: { select: { nome: true, sobrenome: true, apelido: true, avatarUrl: true } },
            },
          },
          equipe: { select: { equipeLabel: true, equipeValue: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(avaliacoes)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'COORDENADOR'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { idEncontro, respostas, indicacoes } = body as {
    idEncontro: string
    respostas: { idPergunta: string; resposta?: string; fileUrl?: string; fileName?: string }[]
    indicacoes: { idEncontreiro: string; equipeIndicada: string; avaliacao: string }[]
  }

  const existing = await prisma.avaliacaoEncontro.findUnique({
    where: { idEncontro_idAutor: { idEncontro, idAutor: session.user.id } },
    select: { id: true },
  })

  if (existing) {
    await prisma.respostaAvaliacao.deleteMany({ where: { idAvaliacao: existing.id } })
    await prisma.indicacaoEncontro.deleteMany({ where: { idAvaliacao: existing.id } })
    const avaliacao = await prisma.avaliacaoEncontro.update({
      where: { id: existing.id },
      data: {
        respostas: {
          create: respostas.map((r) => ({
            idPergunta: r.idPergunta,
            resposta: r.resposta ?? null,
            fileUrl: r.fileUrl ?? null,
            fileName: r.fileName ?? null,
          })),
        },
        indicacoes: {
          create: indicacoes.map((i) => ({
            idEncontreiro: i.idEncontreiro,
            equipeIndicada: i.equipeIndicada,
            avaliacao: i.avaliacao,
          })),
        },
      },
      include: { respostas: true, indicacoes: true },
    })
    return NextResponse.json(avaliacao)
  }

  const avaliacao = await prisma.avaliacaoEncontro.create({
    data: {
      idEncontro,
      idAutor: session.user.id,
      respostas: {
        create: respostas.map((r) => ({
          idPergunta: r.idPergunta,
          resposta: r.resposta ?? null,
          fileUrl: r.fileUrl ?? null,
          fileName: r.fileName ?? null,
        })),
      },
      indicacoes: {
        create: indicacoes.map((i) => ({
          idEncontreiro: i.idEncontreiro,
          equipeIndicada: i.equipeIndicada,
          avaliacao: i.avaliacao,
        })),
      },
    },
    include: { respostas: true, indicacoes: true },
  })

  return NextResponse.json(avaliacao, { status: 201 })
}
