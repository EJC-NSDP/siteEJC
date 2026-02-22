import { NextResponse, type NextRequest } from 'next/server'

import { getCarro, type GetCarroProps } from './get-carro'
import { updateCarro } from './update-carro'

import type { CarFormData } from '@/@types/carro'

export async function GET(
  request: Request,
  context: { params: Promise<GetCarroProps> },
) {
  const carro: CarFormData | null = await getCarro(await context.params)

  return NextResponse.json(carro)
}

export async function PUT(request: NextRequest) {
  const formData: CarFormData = await request.json()

  const updated = await updateCarro(formData)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const carroUpdated = {
    idCarro: updated.idCarro,
    idEncontro: updated.idEncontro,
  }

  return NextResponse.json(carroUpdated, { status: 201 })
}
