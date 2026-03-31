import { NextResponse } from 'next/server'

import { atualizarCirculos } from './atualizar-circulos'
import { getCirculos } from './get-circulos'

export async function GET() {
  const circulos = await getCirculos()

  return NextResponse.json(circulos)
}

export async function PUT(request: Request) {
  const body = await request.json()

  await atualizarCirculos({
    order: body.order,
    circulos: body.circulos,
  })

  return NextResponse.json({ ok: true })
}
