import { NextResponse } from 'next/server'
import { resetRoles } from './reset-roles'

export async function PATCH() {
  const rolesReseted = await resetRoles()

  if (!rolesReseted) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(rolesReseted, { status: 201 })
}
