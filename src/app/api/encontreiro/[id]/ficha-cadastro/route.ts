import { NextResponse } from 'next/server'
import { getEncontreiroCadastro } from './get-encontreiro-cadastro'

interface EncontristaProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: EncontristaProps },
) {
  const encontreiro = await getEncontreiroCadastro(context.params.id)

  return NextResponse.json(encontreiro)
}

// export async function PUT(request: NextRequest) {
//   const formData: EditFormDataInput = await request.json()

//   const updated = await updateEncontreiro(formData)

//   if (!updated) {
//     return NextResponse.json({ status: 400 })
//   }

//   const encontreiroUpdated = {
//     id: updated.id,
//     email: updated.email,
//   }

//   return NextResponse.json(encontreiroUpdated, { status: 201 })
// }
