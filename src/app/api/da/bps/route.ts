import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const anoAtual = new Date().getFullYear()

  const bps = await prisma.lideranca.findMany({
    where: { idFuncao: 'bp', ano: anoAtual },
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
  })

  return NextResponse.json(
    bps.map(({ pessoa }) => ({
      id: pessoa.id,
      nome: pessoa.apelido ?? pessoa.nome,
      nomeCompleto: `${pessoa.nome} ${pessoa.sobrenome}`,
      avatarUrl: pessoa.avatarUrl,
    })),
  )
}
