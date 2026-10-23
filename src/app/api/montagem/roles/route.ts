import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'

import { ajustarRoles } from '../divulgar/divulgarMontagem'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const resultado = await ajustarRoles()

  if (!resultado)
    return NextResponse.json(
      { error: 'Nenhum encontro configurado.' },
      { status: 404 },
    )

  return NextResponse.json(resultado)
}
