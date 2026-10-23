import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { idDA, aberto } = (await request.json()) as {
    idDA: string
    aberto: boolean
  }

  if (aberto) {
    const da = await prisma.diaAmizade.findUnique({
      where: { id: idDA },
      include: { _count: { select: { itens: true } } },
    })

    if (!da)
      return NextResponse.json({ error: 'DA não encontrado.' }, { status: 404 })

    if (!da.dataDA)
      return NextResponse.json(
        { error: 'Defina a data do DA antes de abrir o formulário.' },
        { status: 422 },
      )

    if (!da.mensagemInicial?.trim())
      return NextResponse.json(
        { error: 'Adicione uma mensagem inicial antes de abrir o formulário.' },
        { status: 422 },
      )

    if (da._count.itens === 0)
      return NextResponse.json(
        { error: 'Adicione pelo menos 1 item antes de abrir o formulário.' },
        { status: 422 },
      )
  }

  const da = await prisma.diaAmizade.update({
    where: { id: idDA },
    data: { aberto },
  })

  return NextResponse.json(da)
}
