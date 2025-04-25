import { NextResponse } from 'next/server'
import { deleteEncontrista } from './delete-encontrista'
import { softDeleteEncontrista } from './soft-delete-encontrista'

interface EncontristaProps {
  id: string
}

export async function PATCH(
  request: Request,
  context: { params: Promise<EncontristaProps> },
) {
  const deleted = await softDeleteEncontrista((await context.params).id)

  return NextResponse.json(deleted)
}

export async function DELETE(
  request: Request,
  context: { params: Promise<EncontristaProps> },
) {
  const encontrista = await deleteEncontrista((await context.params).id)

  return NextResponse.json(encontrista)
}
