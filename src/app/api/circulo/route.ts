import { NextResponse } from 'next/server'

import { getCirculosSummary } from './get-circulos-summary'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontroNumber = requestUrl.searchParams.get('encontro')
  const colorLable = requestUrl.searchParams.get('cor')

  const page = pageParams ? Number(pageParams) : 1

  const circulos = await getCirculosSummary({
    page,
    encontroNumber,
    colorLable,
  })

  return NextResponse.json(circulos, { status: 201 })
}
