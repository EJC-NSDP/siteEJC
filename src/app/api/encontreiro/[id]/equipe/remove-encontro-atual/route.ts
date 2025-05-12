import { NextResponse } from 'next/server'
import { removeEncontreiroFromEquipe } from './remove-encontreiro-from-equipe'

interface ProfileProps {
  id: string
}

export async function DELETE(
  request: Request,
  context: { params: Promise<ProfileProps> },
) {
  const encontreiro = await removeEncontreiroFromEquipe(
    (await context.params).id,
  )

  return NextResponse.json(encontreiro)
}
