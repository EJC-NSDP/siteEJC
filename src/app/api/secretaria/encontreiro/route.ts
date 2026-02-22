import { NextResponse } from 'next/server'

import { getEncontreirosSecreSummary } from './get-encontreiros-secre'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontreiroName = requestUrl.searchParams.get('name')
  const encontreiroEquipe = requestUrl.searchParams.get('equipe')
  const encontreiroFicha = requestUrl.searchParams.get('fichaPreenchida')
  const orderByField = requestUrl.searchParams.get('orderByField')
  const orderDirection = requestUrl.searchParams.get('orderDirection')

  const page = pageParams ? Number(pageParams) : 1

  const encontristas = await getEncontreirosSecreSummary({
    page,
    encontreiroName,
    encontreiroEquipe,
    encontreiroFicha,
    orderByField,
    orderDirection,
  })

  return NextResponse.json(encontristas, { status: 201 })
}
