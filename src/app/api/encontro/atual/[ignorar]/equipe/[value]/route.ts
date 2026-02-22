import { NextResponse } from 'next/server'

import { getEquipe } from './get-equipe'

interface EquipeValueProps {
  value: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EquipeValueProps> },
) {
  const equipe = await getEquipe((await context.params).value)

  return NextResponse.json(equipe)
}
