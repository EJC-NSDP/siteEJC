import { NextResponse } from 'next/server'
import { getPastorais } from './get-pastorais'

interface LiderancaProps {
  ano: string
}

export async function GET(
  request: Request,
  context: { params: Promise<LiderancaProps> },
) {
  const requestUrl = new URL(request.url)

  const encontreiroName = requestUrl.searchParams.get('name')
  const pastoral = requestUrl.searchParams.get('pastoral')
  const ano = Number((await context.params).ano)

  const dirisBps = await getPastorais({
    ano,
    encontreiroName,
    pastoral,
  })

  return NextResponse.json(dirisBps)
}
