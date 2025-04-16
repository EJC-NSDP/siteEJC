import { NextResponse } from 'next/server'
import {
  changeStatusMontagem,
  type changeStatusMontagemRouteProps,
} from './change-status'

export async function PATCH(
  request: Request,
  context: { params: changeStatusMontagemRouteProps },
) {
  const updated = await changeStatusMontagem(context.params)

  const infoPatched = {
    id: updated.idPessoa,
    status: updated.statusMontagem,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
