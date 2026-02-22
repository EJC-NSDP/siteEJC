import { NextResponse } from 'next/server'

import { getDirisBPs } from './get-diris-bps'

interface LiderancaProps {
  ano: string
}

export async function GET(
  request: Request,
  context: { params: Promise<LiderancaProps> },
) {
  const dirisBps = await getDirisBPs(Number((await context.params).ano))

  return NextResponse.json(dirisBps)
}
