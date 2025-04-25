import { NextResponse } from 'next/server'
import { updateEndereco, type EnderecoUpdateProps } from './update-endereco'

export async function PUT(
  request: Request,
  context: { params: Promise<EnderecoUpdateProps> },
) {
  const updated = await updateEndereco(await context.params)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(updated, { status: 201 })
}
