import * as XLSX from 'xlsx'
import { getRestricoes } from './get-restricoes'

export async function generateCSV(format?: 'csv' | 'xlsx') {
  const jsonData = await getRestricoes()

  const worksheet = XLSX.utils.json_to_sheet(jsonData)

  if (format === 'csv') {
    return XLSX.utils.sheet_to_csv(worksheet)
  }

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Restrições')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
