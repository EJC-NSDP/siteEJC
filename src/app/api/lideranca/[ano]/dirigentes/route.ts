import { NextResponse } from 'next/server'

import { createDirigentes } from './create-dirigentes'
import { getDirigentes } from './get-dirigentes'
import { updateDirigentes } from './update-dirigentes'

interface LiderancaProps {
  ano: string
}

export async function GET(
  request: Request,
  context: { params: Promise<LiderancaProps> },
) {
  const diris = await getDirigentes(Number((await context.params).ano))
  return NextResponse.json(diris)
}

export async function PUT(
  request: Request,
  context: { params: Promise<LiderancaProps> },
) {
  const ano = Number((await context.params).ano)
  const { dirigentes } = await request.json()
  const result = await updateDirigentes(ano, dirigentes)
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const { dirigentes } = await request.json()
  const result = await createDirigentes(dirigentes)
  return NextResponse.json(result, { status: 201 })
}
