import { NextResponse } from 'next/server'

import { getIdentification } from './get-identification'

interface EncontristaSumaryProps {
  slug: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontristaSumaryProps> },
) {
  const encontrista = await getIdentification((await context.params).slug)

  return NextResponse.json(encontrista)
}
