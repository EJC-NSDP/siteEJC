import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

const DIAS_APOS_INICIO = 3

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const encontro = await prisma.encontro.findFirst({
    orderBy: { numeroEncontro: 'desc' },
    select: { id: true, numeroEncontro: true, dataInicio: true },
  })

  if (!encontro) {
    return NextResponse.json({
      disponivel: false,
      motivo: 'Nenhum encontro configurado.',
    })
  }

  const liberadoEm = new Date(encontro.dataInicio)
  liberadoEm.setDate(liberadoEm.getDate() + DIAS_APOS_INICIO)

  if (new Date() < liberadoEm) {
    return NextResponse.json({
      disponivel: false,
      motivo: `A avaliação estará disponível a partir de ${liberadoEm.toLocaleDateString('pt-BR')}.`,
      liberadoEm,
    })
  }

  const jaEnviou = await prisma.avaliacaoEncontro.findUnique({
    where: {
      idEncontro_idAutor: {
        idEncontro: encontro.id,
        idAutor: session.user.id,
      },
    },
    select: { id: true, createdAt: true },
  })

  return NextResponse.json({
    disponivel: true,
    encontro: { id: encontro.id, numeroEncontro: encontro.numeroEncontro },
    jaEnviou: jaEnviou
      ? { id: jaEnviou.id, createdAt: jaEnviou.createdAt }
      : null,
  })
}
