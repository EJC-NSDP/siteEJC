import { NextResponse } from 'next/server'
import { getPalestranteQuadrante } from './get-palestrante-quadrante'

export async function GET() {
  const palestrante = await getPalestranteQuadrante()

  return NextResponse.json(palestrante, { status: 201 })
}
