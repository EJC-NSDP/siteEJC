import { NextResponse, type NextRequest } from 'next/server'
import { getEquipesSecre, type EquipeSecre } from './get-equipes-secre'
import { updateEquipesSecre } from './update-equipes-secre'

export async function GET() {
  const equipes: EquipeSecre[] = await getEquipesSecre()

  return NextResponse.json(equipes, { status: 201 })
}

export type UpdateEquipesSecreResponse = {
  message: string
  atualizados: string[]
  ignorados: string[]
  naoEncontrados: string[]
}

export async function PATCH(request: NextRequest) {
  const formData: EquipeSecre[] = await request.json()

  if (!Array.isArray(formData) || formData.length === 0) {
    return NextResponse.json(
      { error: 'Nenhuma equipe recebida para atualização.' },
      { status: 400 },
    )
  }

  const resultados = await updateEquipesSecre(formData)

  const atualizados = resultados.filter((e) => e.status === 'updated')
  const ignorados = resultados.filter((e) => e.status === 'skipped')
  const naoEncontrados = resultados.filter((e) => e.status === 'not found')

  return NextResponse.json(
    {
      message: 'Processo concluído.',
      atualizados: atualizados.map((e) => e.equipeValue),
      ignorados: ignorados.map((e) => e.equipeValue),
      naoEncontrados: naoEncontrados.map((e) => e.equipeValue),
    },
    { status: 200 },
  )
}
