import { NextResponse } from 'next/server'
import { getEquipesSecre, type EquipeSecre } from './get-equipes-secre'

export async function GET() {
  const equipes: EquipeSecre[] = await getEquipesSecre()

  return NextResponse.json(equipes, { status: 201 })
}
