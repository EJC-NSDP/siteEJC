import * as XLSX from 'xlsx'

import { getEncontreirosDirigentes } from './get-encontreios-dirigentes'

export async function generateCSV(format?: 'csv' | 'xlsx') {
  const jsonData = await getEncontreirosDirigentes()

  const worksheet = XLSX.utils.json_to_sheet(jsonData)

  if (format === 'csv') {
    return XLSX.utils.sheet_to_csv(worksheet)
  }

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Encontreiros_Dirigentes')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
