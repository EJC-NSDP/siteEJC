import { TableCell, TableRow } from '@/components/ui/table'

import type { EncontreiroSecreSummaryData } from '@/app/api/secretaria/encontreiro/get-encontreiros-secre'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface EncontreiroTableRowProps {
  encontreiro: EncontreiroSecreSummaryData
}

export function EncontreiroSecreTableRow({
  encontreiro,
}: EncontreiroTableRowProps) {
  const [open, setOpen] = useState(false)

  const nomeCompleto = `${encontreiro.nome} ${encontreiro.sobrenome}`

  const colorFichaPreenchida = encontreiro.fichaPreenchida
    ? 'bg-emerald-500'
    : 'bg-red-500'
  const fichaPreenchida = encontreiro.fichaPreenchida ? 'Sim' : 'Não'

  const isCoord = encontreiro.coordena ? 'font-bold' : ''

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TableRow className="items-center bg-white">
        <TableCell className="text-nowrap font-medium">
          {encontreiro.numeroEncontro}
        </TableCell>
        <TableCell>
          {nomeCompleto} {encontreiro.apelido && `(${encontreiro.apelido})`}
        </TableCell>
        <TableCell className={cn(isCoord, 'flex gap-4')}>
          {encontreiro.equipe}
        </TableCell>
        <TableCell className="text-nowrap">{encontreiro.celular}</TableCell>
        <TableCell
          className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
          title={encontreiro.bairro}
        >
          {encontreiro.bairro}
        </TableCell>
        <TableCell
          className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
          title={encontreiro.instagram || ''}
        >
          {encontreiro.instagram && `@${encontreiro.instagram}`}
        </TableCell>

        <TableCell>
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                colorFichaPreenchida,
                'size-3 rounded-full  shadow-sm',
              )}
            />
            <span className="text-xs">{fichaPreenchida}</span>
          </div>
        </TableCell>
        <TableCell className="flex justify-center gap-2">
          <AlertDialogTrigger asChild title="Editar equipe">
            <Button variant="ghost" className="p-0">
              <Pencil className="size-4 text-zinc-400 hover:text-zinc-500" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogTrigger asChild title="Remover desse Encontrão">
            <Button variant="ghost" className="p-0">
              <Trash2 className="size-4 text-red-400 hover:text-red-500" />
            </Button>
          </AlertDialogTrigger>
          {/* <AlertDialogTrigger asChild title="Deletar">
            <Button variant="ghost" className="p-0">
              <Trash2 className="size-4 text-red-400 hover:text-red-500" />
            </Button>
          </AlertDialogTrigger> */}
        </TableCell>
      </TableRow>
    </AlertDialog>
  )
}
