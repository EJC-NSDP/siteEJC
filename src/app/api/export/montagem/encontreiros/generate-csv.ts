import * as XLSX from 'xlsx'

import { getAllEncontreiros } from './get-all-encontreiros'

export async function generateCSV(title: string, format?: 'csv' | 'xlsx') {
  const jsonData = await getAllEncontreiros()

  const worksheet = XLSX.utils.json_to_sheet(jsonData)

  if (format === 'csv') {
    return XLSX.utils.sheet_to_csv(worksheet)
  }

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, title)

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
