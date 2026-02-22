import { NextResponse } from 'next/server'

import { getCores } from './get-cores'

export async function GET() {
  const cores = await getCores()

  return NextResponse.json(cores)
}
