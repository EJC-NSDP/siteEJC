import { NextResponse } from 'next/server'

import { changeStatus, type changeStatusRouteProps } from './change-status'

export async function PATCH(request: Request) {
  const data: changeStatusRouteProps = await request.json()

  const updated = await changeStatus(data)

  const infoPatched = {
    id: updated.idPessoa,
    status: updated.idStatus,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
