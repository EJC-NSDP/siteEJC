import { NextResponse, type NextRequest } from 'next/server'

import { getEncontristaSecre } from './get-encontrista-secre'
import { updateEncontristaSecre } from './update-encontrista-secre'

import type { EditSecreFormDataInput } from '@/app/(app)/admin/secretaria/(encontristas)/[slug]/edit/EditSecreEncontristaForm'

interface EncontristaSecreProps {
  slug: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontristaSecreProps> },
) {
  const encontrista = await getEncontristaSecre((await context.params).slug)

  return NextResponse.json(encontrista, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const formData: EditSecreFormDataInput = await request.json()

  const updated = await updateEncontristaSecre(formData)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const encontristaUpdated = {
    slug: updated.slug,
  }

  return NextResponse.json(encontristaUpdated, { status: 201 })
}
