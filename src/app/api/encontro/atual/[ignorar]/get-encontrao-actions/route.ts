import { NextResponse } from 'next/server'

import { getEncontraoActions } from './get-encontrao-actions'

export async function GET() {
  const encontroActions = await getEncontraoActions()

  if (!encontroActions) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(encontroActions, { status: 201 })
}
