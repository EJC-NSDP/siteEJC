import { NextResponse, type NextRequest } from 'next/server'

import { createEncontreiro } from './create-encontreiro'
import { getEncontreirosSummary } from './get-encontreiros-summary'

import type { EncontreiroFormData } from '@/@types/encontreiro'

export async function POST(request: NextRequest) {
  const formData: EncontreiroFormData = await request.json()

  const pessoa = await createEncontreiro(formData)

  return NextResponse.json(pessoa, { status: 201 })
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontreiroName = requestUrl.searchParams.get('name')
  const encontreiroStatus = requestUrl.searchParams.get('encontreiroStatus')
  const orderByField = requestUrl.searchParams.get('orderByField')
  const orderDirection = requestUrl.searchParams.get('orderDirection')

  const page = pageParams ? Number(pageParams) : 1

  const encontreiros = await getEncontreirosSummary({
    page,
    encontreiroName,
    encontreiroStatus,
    orderByField,
    orderDirection,
  })

  return NextResponse.json(encontreiros, { status: 201 })
}
