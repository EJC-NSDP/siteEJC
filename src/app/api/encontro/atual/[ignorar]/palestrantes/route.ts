import type { PalestrasData } from '@/app/(app)/admin/secretaria/palestrantes/(pageComponents)/PalestraForm'
import { NextResponse, type NextRequest } from 'next/server'
import { getPalestrantesAtual } from './get-palestrantes'
import { updatePalestrantes } from './update-palestrantes'

export async function GET() {
  const palestrantes = await getPalestrantesAtual()

  return NextResponse.json(palestrantes)
}

export async function PUT(request: NextRequest) {
  const requestedData: PalestrasData = await request.json()

  const palestrantes = await updatePalestrantes(requestedData)

  if (!palestrantes) return NextResponse.json(null, { status: 500 })

  return NextResponse.json(palestrantes, { status: 201 })
}
