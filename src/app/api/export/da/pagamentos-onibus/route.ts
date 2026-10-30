import { formatDate } from 'date-fns'
import { NextResponse, type NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'

import { generateCSV } from './generate-csv'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP']))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = request.nextUrl
  const idDA = searchParams.get('idDA')
  if (!idDA)
    return NextResponse.json({ error: 'idDA é obrigatório.' }, { status: 400 })

  const date = formatDate(new Date(), 'dd_MM_yyyy_HH_mm')

  try {
    const buf = await generateCSV(idDA)
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="da_pagamentos_onibus_${date}.xlsx"`,
        'Content-Type': 'application/vnd.ms-excel',
      },
    })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
      return new Response(e.message, { status: 400 })
    }
  }
}
