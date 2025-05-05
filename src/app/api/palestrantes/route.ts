import { NextResponse } from 'next/server'
import { getPalestrantes } from './get-palestrantes-summary'

export async function GET() {
  const palestrantes = await getPalestrantes()

  return NextResponse.json(palestrantes)
}
