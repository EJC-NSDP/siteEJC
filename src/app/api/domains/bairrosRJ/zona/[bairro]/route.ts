import { NextResponse } from 'next/server'

import { getZona } from './get-zona'

interface BairroProps {
  bairro: string
}

export async function GET(
  request: Request,
  context: { params: Promise<BairroProps> },
) {
  const bairroZona = await getZona((await context.params).bairro)

  return NextResponse.json(bairroZona)
}
