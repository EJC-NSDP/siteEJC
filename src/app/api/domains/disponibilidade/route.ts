import { NextResponse } from 'next/server'
import { getDisponibilidade } from './get-disponibilidade'

export async function GET() {
  const disponibilidade = await getDisponibilidade()

  return NextResponse.json(disponibilidade)
}
