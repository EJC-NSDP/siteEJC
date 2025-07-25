import { NextResponse } from 'next/server'
import { getEncontreirosSummary } from './get-montagem-summary'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontreiroName = requestUrl.searchParams.get('nome')
  const equipeValue = requestUrl.searchParams.get('equipe')
  const preferenciaValue = requestUrl.searchParams.get('preferencia')
  const orderByField = requestUrl.searchParams.get('orderByField')
  const orderDirection = requestUrl.searchParams.get('orderDirection')

  const page = pageParams ? Number(pageParams) : 1

  console.log(preferenciaValue)

  const encontreiros = await getEncontreirosSummary({
    page,
    encontreiroName,
    equipeValue,
    orderByField,
    orderDirection,
    preferenciaValue,
  })

  return NextResponse.json(encontreiros, { status: 201 })
}
