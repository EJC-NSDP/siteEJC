import { formatDate } from 'date-fns'
import type { NextRequest } from 'next/server'
import { generateCSV } from './generate-csv'

// http://localhost:3003/api/export/convidados-especiais?format=csv

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const formatParam = searchParams.get('format')
  const format = formatParam === 'csv' ? 'csv' : 'xlsx'
  const date = formatDate(new Date(), 'dd_MM_yyyy_HH_mm')

  try {
    const buf = await generateCSV(format)

    if (format === 'csv') {
      return new Response(buf, {
        status: 200,
        headers: {
          'Content-Disposition': `attachment; filename="convidado_especial_${date}.csv"`,
          'Content-Type': 'text/csv',
        },
      })
    }

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="convidado_especial_${date}.xlsx"`,
        'Content-Type': 'application/vnd.ms-excel',
      },
    })
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
      return new Response(e.message, {
        status: 400,
      })
    }
  }
}
