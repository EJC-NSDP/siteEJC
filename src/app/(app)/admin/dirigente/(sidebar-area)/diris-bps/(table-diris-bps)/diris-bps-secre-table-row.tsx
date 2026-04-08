import type { DiriBP } from '@/app/api/lideranca/[ano]/diris-bps/get-diris-bps'
import { TableCell, TableRow } from '@/components/ui/table'

interface DirisBpsTableRowProps {
  pessoa: DiriBP
}

export function DirisBpsTableRow({ pessoa }: DirisBpsTableRowProps) {
  return (
    <TableRow className="items-center bg-white">
      <TableCell className="font-medium text-nowrap">{pessoa.nome}</TableCell>
      <TableCell>{pessoa.funcao}</TableCell>
    </TableRow>
  )
}
