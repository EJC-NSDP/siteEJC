import { NextResponse, type NextRequest } from 'next/server'

import { createEncontro, type EncontroProps } from './create-encontro'
import { getEncontros } from './get-encontros'

export async function POST(request: NextRequest) {
  const requestedData: EncontroProps = await request.json()

  const encontro = await createEncontro(requestedData)

  return NextResponse.json(encontro, { status: 201 })
}

export async function GET() {
  const encontros = await getEncontros()

  return NextResponse.json(encontros)
}
