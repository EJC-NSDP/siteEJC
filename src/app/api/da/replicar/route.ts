import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { idDA } = (await request.json()) as { idDA: string }

  const daAnterior = await prisma.diaAmizade.findFirst({
    where: { id: { not: idDA } },
    orderBy: { encontro: { numeroEncontro: 'desc' } },
    include: { itens: { select: { idItem: true, quantidade: true } } },
  })

  if (!daAnterior || daAnterior.itens.length === 0)
    return NextResponse.json(
      { error: 'Nenhum DA anterior com itens encontrado.' },
      { status: 404 },
    )

  await prisma.itemDA.createMany({
    data: daAnterior.itens.map((i) => ({
      idItem: i.idItem,
      idDA,
      quantidade: i.quantidade,
    })),
    skipDuplicates: true,
  })

  return NextResponse.json({ copiados: daAnterior.itens.length })
}
