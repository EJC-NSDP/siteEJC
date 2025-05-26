import { NextRequest, NextResponse } from 'next/server'

import type { valueStatus } from '@/@types/enums'
import {
  createEncontrista,
  type CreateEncontristaProps,
} from './create-encontrista'
import { getEncontristasSummary } from './get-encontristas-summary'

export async function POST(request: NextRequest) {
  const formData: CreateEncontristaProps = await request.json()

  const pessoa = await createEncontrista(formData)

  return NextResponse.json(pessoa, { status: 201 })
}

export interface searchParams {
  page: number
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontristaName = requestUrl.searchParams.get('name')
  const encontristaStatusParams = requestUrl.searchParams.get('status')
  const responsavelExterna = requestUrl.searchParams.get('idExterna')
  const orderByField = requestUrl.searchParams.get('orderByField')
  const orderDirection = requestUrl.searchParams.get('orderDirection')

  const page = pageParams ? Number(pageParams) : 1

  const encontristaStatus = encontristaStatusParams
    ? (encontristaStatusParams as valueStatus)
    : null

  const encontristas = await getEncontristasSummary({
    page,
    responsavelExterna,
    encontristaName,
    encontristaStatus,
    orderByField,
    orderDirection,
  })

  // const encontristas = await getAllEncontristasSummary()

  return NextResponse.json(encontristas, { status: 201 })
}
