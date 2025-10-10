import { NextResponse } from 'next/server'
import {
  changeStatusMontagem,
  type changeStatusMontagemRouteProps,
} from './change-status'

export async function PATCH(request: Request) {
  const data: changeStatusMontagemRouteProps = await request.json()

  const updated = await changeStatusMontagem(data)

  if (!updated) return NextResponse.json({}, { status: 400 })

  const infoPatched = {
    id: updated.idPessoa,
    status: updated.statusMontagem,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
