import { NextResponse } from 'next/server'

import { getEncontreirosSummary } from './get-encontreiros-summary'

// export async function POST(request: NextRequest) {
//   const formData: CreateEncontreiroProps = await request.json()

//   const pessoa = await createEncontreiro(formData)

//   return NextResponse.json(pessoa, { status: 201 })
// }

// export interface searchParams {
//   page: number
// }

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  const pageParams = requestUrl.searchParams.get('page')
  const encontreiroName = requestUrl.searchParams.get('name')
  const orderByField = requestUrl.searchParams.get('orderByField')
  const orderDirection = requestUrl.searchParams.get('orderDirection')

  const page = pageParams ? Number(pageParams) : 1

  const encontreiros = await getEncontreirosSummary({
    page,
    encontreiroName,
    orderByField,
    orderDirection,
  })

  return NextResponse.json(encontreiros, { status: 201 })
}
