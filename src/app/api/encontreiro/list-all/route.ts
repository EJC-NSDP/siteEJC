import { NextResponse } from 'next/server'

import { listAllEncontreiros } from './list-all-encontreiros'

export async function GET() {
  const encontreiros = await listAllEncontreiros()

  return NextResponse.json(encontreiros, { status: 201 })
}
