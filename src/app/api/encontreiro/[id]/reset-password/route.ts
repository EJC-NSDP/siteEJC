import { NextResponse } from 'next/server'
import { resetPassword } from './reset-password'

export interface ResetPasswordProps {
  id: string
}

export async function PATCH(
  request: Request,
  context: { params: Promise<ResetPasswordProps> },
) {
  const updated = await resetPassword(await context.params)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const infoPatched = {
    id: updated.id,
  }

  return NextResponse.json(infoPatched, { status: 201 })
}
