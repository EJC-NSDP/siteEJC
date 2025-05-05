import { NextResponse } from 'next/server'
import { getPalestrantesAtual } from './get-palestrantes'

export async function GET() {
  const palestrantes = await getPalestrantesAtual()

  return NextResponse.json(palestrantes)
}
