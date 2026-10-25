import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP', 'ENCONTREIRO']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { nome, sobrenome, celular, apelido } = (await request.json()) as {
    nome: string
    sobrenome: string
    celular: string
    apelido?: string | null
  }

  if (!nome?.trim() || !sobrenome?.trim() || !celular?.trim())
    return NextResponse.json(
      { error: 'Nome, sobrenome e celular são obrigatórios.' },
      { status: 400 },
    )

  const pessoa = await prisma.pessoa.update({
    where: { id: session.user.id },
    data: {
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      celular: celular.trim(),
      apelido: apelido?.trim() || null,
    },
    select: { nome: true, sobrenome: true, celular: true, apelido: true },
  })

  return NextResponse.json(pessoa)
}
