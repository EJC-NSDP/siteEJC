import { NextResponse } from 'next/server'
import { getFuncoes } from './get-funcoes'

export async function GET() {
  const funcoes = await getFuncoes()

  return NextResponse.json(funcoes)
}
