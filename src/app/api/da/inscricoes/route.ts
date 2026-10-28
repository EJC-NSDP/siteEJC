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

  const inscricoes = await prisma.inscricaoDA.findMany({
    where: { idDA },
    include: {
      pessoa: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
          avatarUrl: true,
          encontreiro: {
            select: { encontro: { select: { numeroEncontro: true } } },
          },
        },
      },
      itemDA: {
        include: { item: { select: { nome: true } } },
      },
      carroDa: {
        select: { modelo: true, placa: true },
      },
      onibusDA: {
        select: { nome: true },
      },
      responsavelBP: {
        select: {
          id: true,
          nome: true,
          sobrenome: true,
          apelido: true,
          avatarUrl: true,
        },
      },
      grupoCarne: {
        include: {
          membros: {
            include: {
              pessoa: {
                select: {
                  id: true,
                  nome: true,
                  sobrenome: true,
                  apelido: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const result = inscricoes.map((ins) => ({
    idPessoa: ins.idPessoa,
    idDA: ins.idDA,
    idItem: ins.idItem,
    comoVai: ins.comoVai,
    createdAt: ins.createdAt,
    pessoa: {
      id: ins.pessoa.id,
      nome: ins.pessoa.nome,
      sobrenome: ins.pessoa.sobrenome,
      apelido: ins.pessoa.apelido,
      avatarUrl: ins.pessoa.avatarUrl,
      numeroEJC: ins.pessoa.encontreiro?.encontro?.numeroEncontro ?? null,
    },
    item: {
      id: ins.idItem,
      nome: ins.itemDA.item.nome,
      quantidade: ins.itemDA.quantidade,
    },
    descricaoItem: ins.descricaoItem,
    observacao: ins.observacao,
    veiculo: ins.carroDa
      ? {
          tipo: 'carro' as const,
          nome: [ins.carroDa.modelo, ins.carroDa.placa]
            .filter(Boolean)
            .join(' · '),
        }
      : ins.onibusDA
        ? { tipo: 'onibus' as const, nome: ins.onibusDA.nome }
        : null,
    responsavelBP: ins.responsavelBP
      ? {
          id: ins.responsavelBP.id,
          nome: ins.responsavelBP.apelido ?? ins.responsavelBP.nome,
          avatarUrl: ins.responsavelBP.avatarUrl,
        }
      : null,
    companheiros: ins.grupoCarne
      ? ins.grupoCarne.membros
          .filter((m) => m.idPessoa !== ins.idPessoa)
          .map(
            (m) => m.pessoa.apelido ?? `${m.pessoa.nome} ${m.pessoa.sobrenome}`,
          )
      : [],
  }))

  return NextResponse.json(result)
}
