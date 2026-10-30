import * as XLSX from 'xlsx'

import { prisma } from '@/lib/prisma'

function nomePessoa(p: { nome: string; sobrenome: string; apelido: string | null }) {
  return p.apelido ?? `${p.nome} ${p.sobrenome}`
}

export async function generateCSV(idDA: string) {
  const onibus = await prisma.onibusDA.findMany({
    where: { idDA },
    include: {
      passageiros: {
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
          responsavelBP: { select: { nome: true, sobrenome: true, apelido: true } },
        },
        orderBy: [{ pessoa: { nome: 'asc' } }],
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const rows = onibus.flatMap((o) =>
    o.passageiros.map((p) => ({
      Ônibus: o.nome,
      Pessoa: nomePessoa(p.pessoa),
      Encontro: p.pessoa.encontreiro?.encontro?.numeroEncontro ?? '',
      Pagamento: p.pagouOnibus
        ? 'Pago'
        : p.pendentePagamento
          ? 'Pendente'
          : 'Não pago',
      'Valor pago (R$)':
        p.valorPago !== null ? Number(p.valorPago).toFixed(2) : '',
      'BP responsável': p.responsavelBP ? nomePessoa(p.responsavelBP) : '',
    })),
  )

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ônibus')
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}
