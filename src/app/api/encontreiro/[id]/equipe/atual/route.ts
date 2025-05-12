import { NextResponse } from 'next/server'
import { getEncontreiroEquipeAtual } from './get-encontreiro-equipe-atual'

interface EncontreiroEquipeAtualProps {
  id: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontreiroEquipeAtualProps> },
) {
  const encontreiro = await getEncontreiroEquipeAtual((await context.params).id)

  return NextResponse.json(encontreiro)
}
