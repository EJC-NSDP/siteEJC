import { NextResponse } from 'next/server'
import { limparCartas } from './limpar-cartas'

export async function PATCH() {
  const cartas = await limparCartas()

  if (!cartas) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(cartas, { status: 201 })
}
