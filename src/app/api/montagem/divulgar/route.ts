import { NextResponse } from 'next/server'

import { divulgarMontagem } from './divulgarMontagem'

export async function PUT() {
  const montagem = await divulgarMontagem()

  if (!montagem) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(montagem, { status: 201 })
}
