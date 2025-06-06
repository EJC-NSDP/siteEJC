import { NextResponse } from 'next/server'
import { changeStatus, type changeStatusRouteProps } from './change-status'

export async function PATCH(
  request: Request,
  context: { params: Promise<changeStatusRouteProps> },
) {
  const updated = await changeStatus(await context.params)

  const infoPatched = {
    id: updated.idPessoa,
    status: updated.idStatus,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
