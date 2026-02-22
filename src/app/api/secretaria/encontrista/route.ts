import { NextResponse } from 'next/server'

import { getEncontristasSecreSummary } from './get-encontristas-secre'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontreiroName = requestUrl.searchParams.get('name')
  const corCirculo = requestUrl.searchParams.get('cor')
  const orderByField = requestUrl.searchParams.get('orderByField')
  const orderDirection = requestUrl.searchParams.get('orderDirection')

  const page = pageParams ? Number(pageParams) : 1

  const encontristas = await getEncontristasSecreSummary({
    page,
    encontreiroName,
    corCirculo,
    orderByField,
    orderDirection,
  })

  return NextResponse.json(encontristas, { status: 201 })
}
