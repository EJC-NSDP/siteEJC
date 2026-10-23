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

  const { idDA, dataDA } = (await request.json()) as {
    idDA: string
    dataDA: string | null
  }

  const da = await prisma.diaAmizade.update({
    where: { id: idDA },
    data: { dataDA: dataDA ? new Date(dataDA) : null },
  })

  return NextResponse.json(da)
}
