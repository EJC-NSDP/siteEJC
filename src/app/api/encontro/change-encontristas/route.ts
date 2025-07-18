import { NextResponse } from 'next/server'
import { changeEncontristas } from './change-encontristas'

export async function PATCH() {
  const encontristas = await changeEncontristas()

  if (!encontristas) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(encontristas, { status: 201 })
}
