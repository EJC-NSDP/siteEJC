import { NextResponse } from 'next/server'

import { getEncontreiroEquipeMontagem } from './get-equipe'

interface EncontristaProps {
  slug: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontristaProps> },
) {
  const encontreiro = await getEncontreiroEquipeMontagem(
    (await context.params).slug,
  )

  return NextResponse.json(encontreiro)
}
