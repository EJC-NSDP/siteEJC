import { NextResponse } from 'next/server'

import { getDons } from './get-dons'

export async function GET() {
  const dons = await getDons()

  return NextResponse.json(dons)
}
