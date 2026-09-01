'use client'

import type { PessoaPastoral } from '@/app/api/lideranca/[ano]/pastorais/get-pastorais'
import { TableCell, TableRow } from '@/components/ui/table'

interface PastoraisSecreTableRowProps {
  pessoa: PessoaPastoral
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
