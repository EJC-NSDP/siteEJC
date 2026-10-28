import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP', 'ENCONTREIRO']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { status } = (await request.json()) as {
    status: 'ACEITO' | 'RECUSADO'
  }

  const convite = await prisma.conviteVeiculoDA.findUnique({
    where: { id },
    include: { carroDa: { select: { id: true, vagas: true } } },
  })
  if (!convite)
    return NextResponse.json(
      { error: 'Convite não encontrado.' },
      { status: 404 },
    )

  const isMotorista = convite.idMotorista === session.user.id
  const isConvidado = convite.idConvidado === session.user.id
  const isAdmin = hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP'])

  if (!isMotorista && !isConvidado && !isAdmin)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  if (convite.status !== 'PENDENTE')
    return NextResponse.json(
      { error: 'Este convite já foi processado.' },
      { status: 409 },
    )

  if (status === 'ACEITO') {
    if (convite.iniciador === 'MOTORISTA' && !isConvidado && !isAdmin)
      return NextResponse.json(
        { error: 'Apenas o convidado pode aceitar este convite.' },
        { status: 403 },
      )
    if (convite.iniciador === 'CARONA' && !isMotorista && !isAdmin)
      return NextResponse.json(
        { error: 'Apenas o motorista pode aceitar este convite.' },
        { status: 403 },
      )
  }

  if (status === 'RECUSADO') {
    await prisma.conviteVeiculoDA.update({
      where: { id },
      data: { status: 'RECUSADO' },
    })
    // Se o motorista recusou convite de carona que já estava inscrito com este carro
    if (convite.iniciador === 'CARONA' && convite.idCarroDA) {
      await prisma.inscricaoDA.updateMany({
        where: {
          idPessoa: convite.idConvidado,
          idDA: convite.idDA,
          idCarroDA: convite.idCarroDA,
        },
        data: { idCarroDA: null },
      })
    }
    const updated = await prisma.conviteVeiculoDA.findUnique({ where: { id } })
    return NextResponse.json(updated)
  }

  // ACEITO — comportamento depende do iniciador
  if (convite.iniciador === 'CARONA') {
    // Motorista aceitando pedido de carona
    const carroMotorista = await prisma.carroDA.findFirst({
      where: { idDA: convite.idDA, idMotorista: convite.idMotorista },
      select: { id: true, vagas: true },
    })

    if (carroMotorista) {
      const [passageiroCount, conviteCount] = await Promise.all([
        prisma.inscricaoDA.count({
          where: {
            idDA: convite.idDA,
            idCarroDA: carroMotorista.id,
            comoVai: 'CARONA',
          },
        }),
        prisma.conviteVeiculoDA.count({
          where: {
            idCarroDA: carroMotorista.id,
            status: 'PENDENTE',
            id: { not: id },
          },
        }),
      ])
      if (passageiroCount + conviteCount >= carroMotorista.vagas)
        return NextResponse.json(
          { error: 'Seu carro está cheio.' },
          { status: 409 },
        )

      await prisma.conviteVeiculoDA.update({
        where: { id },
        data: { status: 'ACEITO', idCarroDA: carroMotorista.id },
      })
      // Atualiza InscricaoDA do carona se ele já está inscrito sem carro
      await prisma.inscricaoDA.updateMany({
        where: {
          idPessoa: convite.idConvidado,
          idDA: convite.idDA,
          idCarroDA: null,
          comoVai: 'CARONA',
        },
        data: { idCarroDA: carroMotorista.id },
      })
    } else {
      // Motorista ainda não criou o carro — só marca aceito
      await prisma.conviteVeiculoDA.update({
        where: { id },
        data: { status: 'ACEITO' },
      })
    }
  } else {
    // Convidado aceitando convite do motorista — idCarroDA já está no convite
    // A inscrição com o idCarroDA é criada no POST /da/inscricao
    await prisma.conviteVeiculoDA.update({
      where: { id },
      data: { status: 'ACEITO' },
    })
  }

  const updated = await prisma.conviteVeiculoDA.findUnique({ where: { id } })
  return NextResponse.json(updated)
}
