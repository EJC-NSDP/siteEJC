import { NextResponse } from 'next/server'

import { getPastas } from './get-pastas'

export async function GET() {
  const pastas = await getPastas()

  return NextResponse.json(pastas)
}
