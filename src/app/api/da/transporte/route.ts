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

  const pessoaSelect = {
    id: true,
    nome: true,
    sobrenome: true,
    apelido: true,
    avatarUrl: true,
    encontreiro: { select: { encontro: { select: { numeroEncontro: true } } } },
  }

  const [carros, onibus, inscricoes] = await Promise.all([
    prisma.carroDA.findMany({
      where: { idDA },
      include: {
        motorista: { select: pessoaSelect },
        passageiros: {
          include: {
            pessoa: { select: pessoaSelect },
            responsavelBP: { select: { nome: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.onibusDA.findMany({
      where: { idDA },
      include: {
        passageiros: {
          include: {
            pessoa: { select: pessoaSelect },
            responsavelBP: { select: { nome: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.inscricaoDA.findMany({
      where: { idDA },
      include: {
        pessoa: { select: pessoaSelect },
        responsavelBP: { select: { nome: true } },
      },
    }),
  ])

  type PessoaRaw = (typeof carros)[0]['motorista']
  function mapPessoa(p: PessoaRaw) {
    return {
      id: p.id,
      nome: p.nome,
      sobrenome: p.sobrenome,
      apelido: p.apelido,
      avatarUrl: p.avatarUrl,
      numEncontro: p.encontreiro?.encontro?.numeroEncontro ?? null,
    }
  }

  const carrosMapped = carros.map((c) => ({
    id: c.id,
    modelo: c.modelo,
    placa: c.placa,
    vagas: c.vagas,
    motorista: mapPessoa(c.motorista),
    passageiros: c.passageiros.map((p) => ({
      idPessoa: p.idPessoa,
      pessoa: mapPessoa(p.pessoa),
      comoVai: p.comoVai,
      nomeBP: p.responsavelBP?.nome ?? null,
    })),
    vagasOcupadas: c.passageiros.length,
    vagasLivres: c.vagas - c.passageiros.length,
  }))

  const onibusMapped = onibus.map((o) => ({
    id: o.id,
    nome: o.nome,
    vagas: o.vagas,
    passageiros: o.passageiros.map((p) => ({
      idPessoa: p.idPessoa,
      pessoa: mapPessoa(p.pessoa),
      pagouOnibus: p.pagouOnibus,
      comoVai: p.comoVai,
      nomeBP: p.responsavelBP?.nome ?? null,
    })),
  }))

  const semVeiculo = inscricoes
    .filter(
      (ins) => !ins.idCarroDA && !ins.idOnibusDA && ins.comoVai !== 'DIRIGINDO',
    )
    .map((ins) => ({
      idPessoa: ins.idPessoa,
      pessoa: mapPessoa(ins.pessoa),
      comoVai: ins.comoVai,
      nomeBP: ins.responsavelBP?.nome ?? null,
    }))

  const stats = {
    total: inscricoes.length,
    dirigindo: inscricoes.filter((i) => i.comoVai === 'DIRIGINDO').length,
    carona: inscricoes.filter((i) => i.comoVai === 'CARONA').length,
    onibus: inscricoes.filter((i) => i.comoVai === 'ONIBUS').length,
    semTransporte: inscricoes.filter((i) => !i.comoVai).length,
  }

  return NextResponse.json({
    carros: carrosMapped,
    onibus: onibusMapped,
    semVeiculo,
    stats,
  })
}
