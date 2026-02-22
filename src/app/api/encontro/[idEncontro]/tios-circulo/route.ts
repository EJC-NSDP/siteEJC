import { NextResponse } from 'next/server'

import { getTiosCirculos } from './get-tios-circulo'

interface EncontroProps {
  idEncontro: string
}
export async function GET(
  request: Request,
  context: { params: Promise<EncontroProps> },
) {
  const tios = await getTiosCirculos((await context.params).idEncontro)

  return NextResponse.json(tios)
}
