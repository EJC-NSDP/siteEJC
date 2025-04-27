import { NextResponse } from 'next/server'
import { getEncontristasSecre } from './get-encontristas-secre'

export async function GET() {
  // request: Request
  // const requestUrl = new URL(request.url)

  // const pageParams = requestUrl.searchParams.get('page')
  // const encontristaName = requestUrl.searchParams.get('name')
  // const encontristaStatusParams = requestUrl.searchParams.get('status')
  // const responsavelExterna = requestUrl.searchParams.get('idExterna')
  // const orderByField = requestUrl.searchParams.get('orderByField')
  // const orderDirection = requestUrl.searchParams.get('orderDirection')

  // const page = pageParams ? Number(pageParams) : 1

  // const encontristaStatus = encontristaStatusParams
  //   ? (encontristaStatusParams as enumStatus)
  //   : null

  // const encontristas = await getEncontristasSecre({
  //   page,
  //   responsavelExterna,
  //   encontristaName,
  //   encontristaStatus,
  //   orderByField,
  //   orderDirection,
  // })

  const encontristas = await getEncontristasSecre()

  return NextResponse.json(encontristas, { status: 201 })
}
