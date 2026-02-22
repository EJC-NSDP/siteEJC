import { NextResponse } from 'next/server'

import { getEquipe } from './get-equipe'

interface ProfileProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<ProfileProps> },
) {
  const encontreiro = await getEquipe((await context.params).id)

  return NextResponse.json(encontreiro)
}
