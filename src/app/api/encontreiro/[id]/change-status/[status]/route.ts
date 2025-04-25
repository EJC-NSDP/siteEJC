import { NextResponse } from 'next/server'
import {
  changeStatusMontagem,
  type changeStatusMontagemRouteProps,
} from './change-status'

export async function PATCH(
  request: Request,
  context: { params: Promise<changeStatusMontagemRouteProps> },
) {
  const updated = await changeStatusMontagem(await context.params)

  if (!updated) return NextResponse.json({}, { status: 400 })

  const infoPatched = {
    id: updated.idPessoa,
    status: updated.statusMontagem,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
