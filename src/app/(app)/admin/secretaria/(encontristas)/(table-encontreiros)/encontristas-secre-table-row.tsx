import { Pencil } from 'lucide-react'
import Link from 'next/link'

import type { EncontristaSecreSummaryData } from '@/app/api/secretaria/encontrista/get-encontristas-secre'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { getCirculoColor } from '@/utils/fetch-color'

interface EncontreiroTableRowProps {
  encontrista: EncontristaSecreSummaryData
}

export function EncontristasSecreTableRow({
  encontrista,
}: EncontreiroTableRowProps) {
  const nomeCompleto = `${encontrista.nome} ${encontrista.sobrenome}`

  const cor = getCirculoColor(encontrista.corCirculo)

  return (
    <TableRow className="items-center bg-white">
      <TableCell>
        {nomeCompleto} {encontrista.apelido && `(${encontrista.apelido})`}
      </TableCell>
      <TableCell className={cn('flex gap-4')}>
        <div className="flex items-center gap-2">
          <div className={cn('h-2 w-2 rounded-full', cor)} />
          <span>{encontrista.corCirculo}</span>
        </div>
      </TableCell>
      <TableCell className="text-nowrap">
        {encontrista.dataNascimento}
      </TableCell>
      <TableCell className="text-nowrap">{encontrista.celular}</TableCell>
      <TableCell
        className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
        title={encontrista.bairro}
      >
        {encontrista.bairro}
      </TableCell>
      <TableCell
        className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
        title={encontrista.instagram || ''}
      >
        {encontrista.instagram && `@${encontrista.instagram}`}
      </TableCell>

      <TableCell className="flex justify-center gap-2">
        <Link href={`/admin/secretaria/${encontrista.slug}/edit`}>
          <Button variant="ghost" className="p-0">
            <Pencil className="size-4 text-zinc-400 hover:text-zinc-500" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  )
}
