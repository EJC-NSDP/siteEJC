import type { EditCadastroFormDataInput } from '@/app/admin/(loggedUser)/ficha-de-cadastro/FichaCadastroForm'
import { NextResponse, type NextRequest } from 'next/server'
import { getEncontreiroCadastro } from './get-encontreiro-cadastro'
import { updateCadastro } from './update-cadastro'

interface EncontristaProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontristaProps> },
) {
  const encontreiro = await getEncontreiroCadastro((await context.params).id)

  return NextResponse.json(encontreiro)
}

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
