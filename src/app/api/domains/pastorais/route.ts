import { NextResponse } from 'next/server'

import { getPastorais } from './get-pastorais'

export async function GET() {
  const pastorais = await getPastorais()

  return NextResponse.json(pastorais)
}
