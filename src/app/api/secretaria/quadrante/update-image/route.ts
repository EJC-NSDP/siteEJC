import type { Value_Quadrante as valueQuadrante } from '@prisma/client'
import { NextResponse, type NextRequest } from 'next/server'
import { updateImage } from './update-image'

export interface UpdateQuadranteData {
  value: valueQuadrante
  imageUrl: string
}

export async function PATCH(request: NextRequest) {
  const formData: UpdateQuadranteData = await request.json()

  console.log(formData)

  const resultados = await updateImage(formData)

  if (!resultados)
    return NextResponse.json(
      { message: 'Erro ao atualizar o quadrante.' },
      { status: 500 },
    )

  return NextResponse.json(
    {
      message: 'Processo concluído.',
      resultados: resultados.value,
    },
    { status: 200 },
  )
}
