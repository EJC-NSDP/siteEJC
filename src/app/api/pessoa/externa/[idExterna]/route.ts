import { NextResponse } from 'next/server'
import { getPreviousExternaInfo } from './get-previous-externa-info'

interface EncontristaProps {
  idExterna: string
}

export async function GET(
  request: Request,
  context: { params: Promise<EncontristaProps> },
) {
  const pessoa = await getPreviousExternaInfo((await context.params).idExterna)

  if (!pessoa) {
    return NextResponse.json('')
  }

  return NextResponse.json(pessoa)
}
