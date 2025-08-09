import { NextResponse } from 'next/server'
import { getBirthdaysOfWeek } from './get-aniversariantes'

export async function GET() {
  const encontreiro = await getBirthdaysOfWeek()

  return NextResponse.json(encontreiro)
}
