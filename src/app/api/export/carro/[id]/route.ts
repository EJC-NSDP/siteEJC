import { NextResponse } from 'next/server'

import { getEncontristaCarro } from './get-encontrista-carro'

interface EncontristaCarroProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontristaCarroProps> },
) {
  const encontristaCarro = await getEncontristaCarro((await context.params).id)

  return NextResponse.json(encontristaCarro, { status: 200 })
}
