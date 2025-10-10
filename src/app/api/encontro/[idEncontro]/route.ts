import { NextResponse } from 'next/server'
import { getEncontro } from './get-encontro'

interface EncontroProps {
  idEncontro: string
}

export async function GET(
  request: Request,
  { params }: { params: Promise<EncontroProps> },
) {
  const encontro = await getEncontro(Number((await params).idEncontro))

  return NextResponse.json(encontro)
}
