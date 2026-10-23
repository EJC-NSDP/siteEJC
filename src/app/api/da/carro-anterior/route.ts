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
  const idPessoa = searchParams.get('idPessoa')
  if (!idPessoa)
    return NextResponse.json(
      { error: 'idPessoa é obrigatório.' },
      { status: 400 },
    )

  const carro = await prisma.carro.findFirst({
    where: { idMotorista: idPessoa },
    select: { modeloCarro: true, placaCarro: true, lugaresCarro: true },
  })

  return NextResponse.json(carro ?? null)
}
