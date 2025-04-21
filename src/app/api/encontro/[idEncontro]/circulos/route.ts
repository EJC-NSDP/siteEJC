import { NextResponse } from 'next/server'
import { getCirculos } from './get-circulos'

interface EncontroProps {
  idEncontro: string
}
export async function GET(
  request: Request,
  context: { params: EncontroProps },
) {
  const circulos = await getCirculos(context.params.idEncontro)

  return NextResponse.json(circulos)
}
