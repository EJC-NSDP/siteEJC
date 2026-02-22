import { NextResponse } from 'next/server'

import { getEncontristasQuadrante } from './get-encontristas-quadrante'

export async function GET() {
  const encontristas = await getEncontristasQuadrante()

  return NextResponse.json(encontristas, { status: 201 })
}
