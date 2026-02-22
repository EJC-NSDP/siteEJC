import { NextResponse } from 'next/server'

import { getTioExterna } from './get-tio-externa'

interface TioExternaProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<TioExternaProps> },
) {
  const encontrista = await getTioExterna((await context.params).id)

  return NextResponse.json(encontrista)
}
