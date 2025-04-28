import { NextResponse } from 'next/server'
import { getEquipe } from './get-equipe'

interface ProfileProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<ProfileProps> },
) {
  const profile = await getEquipe((await context.params).id)

  return NextResponse.json(profile)
}
