import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) return NextResponse.json([])

  const encontreiros = await prisma.encontreiro.findMany({
    where: {
      pessoa: {
        OR: [
          { nome: { contains: q, mode: 'insensitive' } },
          { sobrenome: { contains: q, mode: 'insensitive' } },
          { apelido: { contains: q, mode: 'insensitive' } },
        ],
      },
    },
    select: {
      idPessoa: true,
      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
          avatarUrl: true,
        },
      },
    },
    take: 10,
    orderBy: { pessoa: { nome: 'asc' } },
  })

  return NextResponse.json(encontreiros)
}
