import { NextResponse } from 'next/server'
import { getLastEncontro } from './get-last-encontro'

export async function GET() {
  const encontro = await getLastEncontro()

  return NextResponse.json(encontro)
}
