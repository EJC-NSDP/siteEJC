import { NextResponse } from 'next/server'

import {
  getAllEncontristasRecepcao,
  getEncontristasRecepcaoSummary,
} from './get-encontristas-recepcao'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  if (searchParams.get('all') === 'true') {
    const encontristas = await getAllEncontristasRecepcao()
    return NextResponse.json(encontristas)
  }

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 0
  const encontreiroName = searchParams.get('name')
  const corCirculo = searchParams.get('cor')
  const orderByField = searchParams.get('orderByField')
  const orderDirection = searchParams.get('orderDirection')

  const result = await getEncontristasRecepcaoSummary({
    page,
    encontreiroName,
    corCirculo,
    orderByField,
    orderDirection,
  })

  return NextResponse.json(result)
}
