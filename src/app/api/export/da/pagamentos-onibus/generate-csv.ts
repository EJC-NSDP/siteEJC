import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import * as XLSX from 'xlsx'

import { prisma } from '@/lib/prisma'

function nomePessoa(p: { nome: string; sobrenome: string; apelido: string | null }) {
  return p.apelido ?? `${p.nome} ${p.sobrenome}`
}

export async function generateCSV(idDA: string) {
  const pagamentos = await prisma.pagamentoOnibusDA.findMany({
    where: { idDA },
    include: {
      pessoa: { select: { nome: true, sobrenome: true, apelido: true } },
      onibus: { select: { nome: true } },
      usuario: { select: { nome: true, sobrenome: true, apelido: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const rows = pagamentos.map((p) => ({
    Pessoa: nomePessoa(p.pessoa),
    Ônibus: p.onibus.nome,
    'Valor (R$)': Number(p.valor).toFixed(2),
    'Registrado por': nomePessoa(p.usuario),
    Data: format(p.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR }),
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagamentos')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
