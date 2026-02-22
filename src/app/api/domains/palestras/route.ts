import { NextResponse } from 'next/server'

import { getPalestra } from './get-palestra'

export async function GET() {
  const palestras = await getPalestra()

  return NextResponse.json(palestras)
}
