import { NextResponse } from 'next/server'
import { getEncontreirosSummary } from './get-montagem-summary'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontreiroName = requestUrl.searchParams.get('name')
  const equipeValue = requestUrl.searchParams.get('equipe')
  const orderByField = requestUrl.searchParams.get('orderByField')
  const orderDirection = requestUrl.searchParams.get('orderDirection')

  const page = pageParams ? Number(pageParams) : 1

  const encontreiros = await getEncontreirosSummary({
    page,
    encontreiroName,
    equipeValue,
    orderByField,
    orderDirection,
  })

  return NextResponse.json(encontreiros, { status: 201 })
}
