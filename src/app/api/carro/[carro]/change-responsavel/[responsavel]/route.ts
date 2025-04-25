import { NextResponse } from 'next/server'
import {
  changeResponsavelCarro,
  type changeResponsavelCarroRouteProps,
} from './change-responsavel'

export async function PATCH(
  request: Request,
  context: { params: Promise<changeResponsavelCarroRouteProps> },
) {
  const updated = await changeResponsavelCarro(await context.params)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const infoPatched = {
    id: updated.idCarro,
    responsavel: updated.idExterna,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
