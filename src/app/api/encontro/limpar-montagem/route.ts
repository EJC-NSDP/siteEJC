import { NextResponse } from 'next/server'

import { limparMontagem } from './limpar-montagem'

export async function PATCH() {
  const equipesMontagem = await limparMontagem()

  if (!equipesMontagem) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(equipesMontagem, { status: 201 })
}
