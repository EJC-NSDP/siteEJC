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

  const [carros, onibus, inscricoes, convitesCarona] = await Promise.all([
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
    prisma.conviteVeiculoDA.findMany({
      where: { idDA },
      select: {
        id: true,
        idConvidado: true,
        idCarroDA: true,
        status: true,
        motorista: { select: { nome: true, sobrenome: true, apelido: true } },
        convidado: { select: pessoaSelect },
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

  const carrosMapped = carros.map((c) => {
    const passageirosConfirmados = c.passageiros.map((p) => ({
      idPessoa: p.idPessoa,
      pessoa: mapPessoa(p.pessoa),
      comoVai: p.comoVai,
      nomeBP: p.responsavelBP?.nome ?? null,
      conviteStatus:
        convitesCarona.find(
          (cv) => cv.idConvidado === p.idPessoa && cv.idCarroDA === c.id,
        )?.status ?? null,
    }))

    const pendentes = convitesCarona.filter(
      (cv) =>
        cv.idCarroDA === c.id &&
        cv.status === 'PENDENTE' &&
        !c.passageiros.some((p) => p.idPessoa === cv.idConvidado),
    )

    return {
      id: c.id,
      modelo: c.modelo,
      placa: c.placa,
      vagas: c.vagas,
      motorista: mapPessoa(c.motorista),
      passageiros: passageirosConfirmados,
      convitesPendentes: pendentes.map((cv) => ({
        idPessoa: cv.idConvidado,
        pessoa: mapPessoa(cv.convidado),
      })),
      vagasOcupadas: passageirosConfirmados.length + pendentes.length,
      vagasLivres: c.vagas - passageirosConfirmados.length - pendentes.length,
    }
  })

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
    .map((ins) => {
      const convite = convitesCarona.find(
        (c) => c.idConvidado === ins.idPessoa && c.status !== 'RECUSADO',
      )
      const nomeMotorista = convite
        ? (convite.motorista.apelido ??
          `${convite.motorista.nome} ${convite.motorista.sobrenome}`)
        : null
      return {
        idPessoa: ins.idPessoa,
        pessoa: mapPessoa(ins.pessoa),
        comoVai: ins.comoVai,
        nomeBP: ins.responsavelBP?.nome ?? null,
        conviteMotorista: nomeMotorista,
      }
    })

  const pendentesSemInscricao = convitesCarona.filter(
    (cv) =>
      cv.status === 'PENDENTE' &&
      !inscricoes.some((i) => i.idPessoa === cv.idConvidado),
  )

  const stats = {
    total: inscricoes.length + pendentesSemInscricao.length,
    dirigindo: inscricoes.filter((i) => i.comoVai === 'DIRIGINDO').length,
    carona:
      inscricoes.filter((i) => i.comoVai === 'CARONA').length +
      pendentesSemInscricao.length,
    onibus: inscricoes.filter((i) => !!i.idOnibusDA).length,
    semTransporte: inscricoes.filter(
      (i) => !i.idCarroDA && !i.idOnibusDA && i.comoVai !== 'DIRIGINDO',
    ).length,
  }

  return NextResponse.json({
    carros: carrosMapped,
    onibus: onibusMapped,
    semVeiculo,
    stats,
  })
}
