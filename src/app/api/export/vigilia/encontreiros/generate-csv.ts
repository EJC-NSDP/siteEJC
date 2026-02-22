import * as XLSX from 'xlsx'

import { getEncontreirosVigilia } from './get-encontreios-vigilia'

export async function generateCSV(format?: 'csv' | 'xlsx') {
  const jsonData = await getEncontreirosVigilia()

  const worksheet = XLSX.utils.json_to_sheet(jsonData)

  if (format === 'csv') {
    return XLSX.utils.sheet_to_csv(worksheet)
  }

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Encontreiros_Vigilia')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
