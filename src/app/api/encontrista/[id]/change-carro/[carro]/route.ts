import { NextResponse } from 'next/server'
import { changeCarro, type changeCarroRouteProps } from './change-carro'

export async function PATCH(
  request: Request,
  context: { params: Promise<changeCarroRouteProps> },
) {
  const updated = await changeCarro(await context.params)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const infoPatched = {
    id: updated.idPessoa,
    idCarroEncontro: updated.carroEncontro?.id,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
