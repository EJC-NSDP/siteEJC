import { NextResponse } from 'next/server'
import { getBonsPastoresQuadrante } from './get-bons-pastores-quadrante'

export async function GET() {
  const bonsPastores = await getBonsPastoresQuadrante()

  return NextResponse.json(bonsPastores, { status: 201 })
}
