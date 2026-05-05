'use client'


import type { PessoaPastoral } from '@/app/api/lideranca/[ano]/pastorais/get-pastorais'
import { TableCell, TableRow } from '@/components/ui/table'
import { api } from '@/lib/axios'

interface PastoraisSecreTableRowProps {
  pessoa: PessoaPastoral
}

async function deletePastoral(id: string) {
  const ano = new Date().getFullYear()

  await api.delete(`lideranca/${ano}/pastorais/${id}`)
}

export function PastoraisSecreTableRow({
  pessoa,
}: PastoraisSecreTableRowProps) {

  return (
    <TableRow className="items-center bg-white">
      <TableCell className="font-medium text-nowrap">{pessoa.nome}</TableCell>
      <TableCell>{pessoa.pastoral}</TableCell>
    </TableRow>
  )
}
