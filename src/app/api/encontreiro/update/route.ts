import type { EditCadastroFormDataInput } from '@/app/admin/(loggedUser)/ficha-de-cadastro/FichaCadastroForm'
import { NextResponse, type NextRequest } from 'next/server'
import { updateCadastro } from './update-cadastro'

export async function PUT(request: NextRequest) {
  const formData: EditCadastroFormDataInput = await request.json()

  const updated = await updateCadastro(formData)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  const encontreiroUpdated = {
    id: updated.id,
    email: updated.email,
  }

  return NextResponse.json(encontreiroUpdated, { status: 201 })
}
