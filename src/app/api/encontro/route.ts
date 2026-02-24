import { NextResponse, type NextRequest } from 'next/server'

import { createEncontro } from './create-encontro'
import { editEncontro, type EncontroProps } from './edit-encontro'
import { getEncontros } from './get-encontros'

export async function GET() {
  const encontros = await getEncontros()

  return NextResponse.json(encontros)
}

export async function PUT(request: NextRequest) {
  const requestedData: EncontroProps = await request.json()

  const encontro = await editEncontro(requestedData)

  return NextResponse.json(encontro, { status: 201 })
}

export async function POST() {
  const encontro = await createEncontro()

  return NextResponse.json(encontro, { status: 201 })
}
