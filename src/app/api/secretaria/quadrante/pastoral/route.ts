import { NextResponse } from 'next/server'

import { getPastoraisQuadrante } from './get-pastoral-quadrante'

export async function GET() {
  const pastorais = await getPastoraisQuadrante()

  return NextResponse.json(pastorais, { status: 201 })
}
