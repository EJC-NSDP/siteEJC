import type { DiriBP } from '@/app/api/lideranca/[ano]/diris-bps/get-diris-bps'
import { TableCell, TableRow } from '@/components/ui/table'

interface DirisBpsSecreTableRowProps {
  pessoa: DiriBP
}

export function DirisBpsSecreTableRow({ pessoa }: DirisBpsSecreTableRowProps) {
  return (
    <TableRow className="items-center bg-white">
      <TableCell className="font-medium text-nowrap">{pessoa.nome}</TableCell>
      <TableCell>{pessoa.funcao}</TableCell>
    </TableRow>
  )
}
