import { NextResponse } from 'next/server'

import { getEquipe } from './get-equipe'

interface EquipeProps {
  value: string
}
export async function GET(
  request: Request,
  context: { params: Promise<EquipeProps> },
) {
  const equipe = await getEquipe((await context.params).value)

  return NextResponse.json(equipe, { status: 201 })
}
