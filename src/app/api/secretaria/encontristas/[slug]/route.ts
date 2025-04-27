import type { EditFormDataInput } from '@/app/admin/externa/[slug]/edit/EditEncontristaForm'
import { NextResponse, type NextRequest } from 'next/server'
import { getEncontristaSecre } from './get-encontrista-secre'
import { updateEncontristaSecre } from './update-encontrista-secre'

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
  const formData: EditFormDataInput = await request.json()

  const updated = await updateEncontristaSecre(formData)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const encontristaUpdated = {
    id: updated.id,
    email: updated.email,
  }

  return NextResponse.json(encontristaUpdated, { status: 201 })
}
