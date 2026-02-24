import { NextResponse, type NextRequest } from 'next/server'

import type { EncontreiroFormData } from '@/@types/encontreiro'

import { getEditEncontreiro } from './get-edit-encontreiro'
import { updateEncontreiro } from './update-encontreiro'

interface EncontreiroProps {
  slug: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontreiroProps> },
) {
  const encontreiro = await getEditEncontreiro((await context.params).slug)

  return NextResponse.json(encontreiro)
}

export async function PUT(request: NextRequest) {
  const formData: EncontreiroFormData = await request.json()

  const updated = await updateEncontreiro(formData)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const encontristaUpdated = {
    id: updated.id,
    email: updated.email,
  }

  return NextResponse.json(encontristaUpdated, { status: 201 })
}
