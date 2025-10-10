import { NextResponse } from 'next/server'
import { updateEndereco, type EnderecoUpdateProps } from './update-endereco'

export async function PUT(request: Request) {
  const data: EnderecoUpdateProps = await request.json()

  const updated = await updateEndereco(data)

  if (!updated) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(updated, { status: 201 })
}
