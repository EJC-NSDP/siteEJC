import * as XLSX from 'xlsx'

import { prisma } from '@/lib/prisma'

export async function generateCSV(idDA: string) {
  const inscricoes = await prisma.inscricaoDA.findMany({
    where: { idDA },
    include: {
      pessoa: {
        select: {
          nome: true,
          sobrenome: true,
          apelido: true,
          encontreiro: {
            select: { encontro: { select: { numeroEncontro: true } } },
          },
        },
      },
    },
    orderBy: { pessoa: { nome: 'asc' } },
  })

  const rows = inscricoes.map((i) => ({
    Nome:
      i.pessoa.apelido ?? `${i.pessoa.nome} ${i.pessoa.sobrenome}`,
    Encontro: i.pessoa.encontreiro?.encontro?.numeroEncontro ?? '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscritos')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
