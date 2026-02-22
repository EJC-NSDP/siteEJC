import { NextResponse, type NextRequest } from 'next/server'

import { getConfigQuadrante } from './get-config-quadrante'
import { updateConfigQuadrante } from './update-config-quadrante'

import type { Value_Quadrante as valueQuadrante } from '@/enums'

export async function GET() {
  const capas = await getConfigQuadrante()

  return NextResponse.json(capas, { status: 201 })
}

export type UpdateQuadranteSettingsResponse = {
  message: string
  atualizados: string[]
  ignorados: string[]
  naoEncontrados: string[]
}

export interface UpdateQuadranteData {
  value: valueQuadrante
  imageUrl: string
}

export async function PATCH(request: NextRequest) {
  const formData: UpdateQuadranteData[] = await request.json()

  if (!Array.isArray(formData) || formData.length === 0) {
    return NextResponse.json(
      { error: 'Nenhuma equipe recebida para atualização.' },
      { status: 400 },
    )
  }

  const resultados = await updateConfigQuadrante(formData)

  const atualizados = resultados.filter((e) => e.status === 'updated')
  const ignorados = resultados.filter((e) => e.status === 'skipped')
  const naoEncontrados = resultados.filter((e) => e.status === 'not found')

  return NextResponse.json(
    {
      message: 'Processo concluído.',
      atualizados: atualizados.map((e) => e.value),
      ignorados: ignorados.map((e) => e.value),
      naoEncontrados: naoEncontrados.map((e) => e.value),
    },
    { status: 200 },
  )
}
