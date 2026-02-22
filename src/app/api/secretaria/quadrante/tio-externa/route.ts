import { NextResponse } from 'next/server'

import { getTiosExternaQuadrante } from './get-tio-externa-quadrante'

export async function GET() {
  const tiosExterna = await getTiosExternaQuadrante()

  return NextResponse.json(tiosExterna, { status: 201 })
}
