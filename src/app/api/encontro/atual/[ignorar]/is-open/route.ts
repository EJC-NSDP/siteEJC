import { NextResponse } from 'next/server'

import { isEncontroOpen } from './is-encontro-open'

export async function GET() {
  const isOpen = await isEncontroOpen()

  return NextResponse.json(isOpen, { status: 201 })
}
