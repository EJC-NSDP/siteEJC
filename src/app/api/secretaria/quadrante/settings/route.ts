import { NextResponse } from 'next/server'
import { getConfigQuadrante } from './get-config-quadrante'

export async function GET() {
  const capas = await getConfigQuadrante()

  return NextResponse.json(capas, { status: 201 })
}
