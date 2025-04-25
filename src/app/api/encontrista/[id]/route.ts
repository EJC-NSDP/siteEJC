import { NextResponse } from 'next/server'
import { getEncontrista } from './get-encontrista'

interface EncontristaProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontristaProps> },
) {
  const encontrista = await getEncontrista((await context.params).id)

  return NextResponse.json(encontrista)
}
