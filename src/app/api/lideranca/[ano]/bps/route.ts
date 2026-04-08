import { NextResponse } from 'next/server'

import { getBPs } from './get-bps'
import { updateBPs } from './update-bps'

interface LiderancaProps {
  ano: string
}

export async function GET(
  request: Request,
  context: { params: Promise<LiderancaProps> },
) {
  const bps = await getBPs(Number((await context.params).ano))
  return NextResponse.json(bps)
}

export async function PUT(
  request: Request,
  context: { params: Promise<LiderancaProps> },
) {
  const ano = Number((await context.params).ano)
  const { bps } = await request.json()
  const result = await updateBPs(ano, bps)
  return NextResponse.json(result)
}

// export async function POST(request: Request) {
//   const { bps } = await request.json()
//   const result = await createDirigentes(bps)
//   return NextResponse.json(result, { status: 201 })
// }
