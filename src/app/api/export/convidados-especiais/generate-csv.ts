import * as XLSX from 'xlsx'
import { getAllConvidadosEspeciais } from './get-convidados-especiais'

export async function generateCSV(format?: 'csv' | 'xlsx') {
  const jsonData = await getAllConvidadosEspeciais()

  const worksheet = XLSX.utils.json_to_sheet(jsonData)

  if (format === 'csv') {
    return XLSX.utils.sheet_to_csv(worksheet)
  }

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Convidados Especiais')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
