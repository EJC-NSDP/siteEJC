import { NextResponse } from 'next/server'
import { getEncontreirosQuadrante } from './get-encontreiros-quadrante'

export async function GET() {
  const encontreiros = await getEncontreirosQuadrante()

  return NextResponse.json(encontreiros, { status: 201 })
}
