import { NextResponse, type NextRequest } from 'next/server'

import type { TemasFormDataInput } from '@/app/(app)/admin/apresentacao/(temas)/temas-form'

import { getTemas } from './get-temas'
import { updateTemas } from './update-temas'

export async function GET() {
  const encontroActions = await getTemas()

  if (!encontroActions) {
    return NextResponse.json({ status: 400 })
  }

  return NextResponse.json(encontroActions, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const requestedData: TemasFormDataInput = await request.json()

  const temas = await updateTemas(requestedData)

  if (!temas) return NextResponse.json(null, { status: 500 })

  return NextResponse.json(temas, { status: 201 })
}
