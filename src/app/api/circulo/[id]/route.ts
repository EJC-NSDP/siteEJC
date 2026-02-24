import { NextResponse, type NextRequest } from 'next/server'

import type { CirculoFormData } from '@/@types/circulo'

import { getCirculo } from './get-circulo'
import { updateCirculo } from './update-circulo'

interface CirculoProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<CirculoProps> },
) {
  const circulo = await getCirculo((await context.params).id)

  return NextResponse.json(circulo)
}

export async function PUT(request: NextRequest) {
  const formData: CirculoFormData = await request.json()

  const updated = await updateCirculo(formData)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const encontreiroUpdated = {
    id: updated.id,
    cor: updated.idCorCirculo,
  }

  return NextResponse.json(encontreiroUpdated, { status: 201 })
}
