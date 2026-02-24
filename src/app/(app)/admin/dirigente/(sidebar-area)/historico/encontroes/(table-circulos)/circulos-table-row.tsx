import { Pencil } from 'lucide-react'
import Link from 'next/link'

import type { CirculoSummaryData } from '@/app/api/circulo/get-circulos-summary'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { getCirculoColor } from '@/utils/fetch-color'

interface EncontreiroTableRowProps {
  circulo: CirculoSummaryData
}

export function CirculosTableRow({ circulo }: EncontreiroTableRowProps) {
  const corCirculo = getCirculoColor(circulo.cor || '')

  return (
    <TableRow className="bg-white">
      <TableCell className="pl-4 font-medium text-nowrap">
        {circulo.numeroEncontro}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={cn(corCirculo, 'size-3 rounded-full shadow-sm')} />
          <span className="text-xs">{circulo.cor}</span>
        </div>
      </TableCell>
      <TableCell>{circulo.nome}</TableCell>
      <TableCell>{circulo.tioAparente.nome}</TableCell>
      <TableCell>{circulo.tioSecreto.nome}</TableCell>
      <TableCell className="flex gap-2 pr-4">
        <Link
          href={`/admin/dirigente/circulo/${circulo.id}/edit`}
          title="Editar"
        >
          <Button variant="ghost" className="p-0">
            <Pencil className="size-4 text-zinc-400 hover:text-zinc-500" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  )
}
