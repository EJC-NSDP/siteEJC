import { TableCell, TableRow } from '@/components/ui/table'

import type { DiriBP } from '@/app/api/lideranca/[ano]/diris-bps/get-diris-bps'

interface DirisBpsSecreTableRowProps {
  pessoa: DiriBP
}

export function DirisBpsSecreTableRow({ pessoa }: DirisBpsSecreTableRowProps) {
  return (
    <TableRow className="items-center bg-white">
      <TableCell className="text-nowrap font-medium">{pessoa.nome}</TableCell>
      <TableCell>{pessoa.funcao}</TableCell>
    </TableRow>
  )
}
