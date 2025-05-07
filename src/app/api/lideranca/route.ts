import type { LiderancaFormData } from '@/@types/lideranca'
import { NextResponse, type NextRequest } from 'next/server'
import { addLideranca } from './add-lideranca'

export async function POST(request: NextRequest) {
  const formData: LiderancaFormData = await request.json()

  const lideranca = await addLideranca(formData)

  if (!lideranca) return NextResponse.json(null, { status: 500 })

  return NextResponse.json(lideranca, { status: 201 })
}
