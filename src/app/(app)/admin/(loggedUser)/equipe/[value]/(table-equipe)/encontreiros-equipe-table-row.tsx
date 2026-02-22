import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { EncontreiroEmEquipe } from '@/app/api/encontreiro/[id]/equipe/get-equipe'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { labelPertenceARosa, labelPertenceASala } from '@/utils/pertence'

interface EncontreiroEquipeTableRowProps {
  encontreiro: EncontreiroEmEquipe
  labelEquipeUser: string
}

export function EncontreiroEquipeTableRow({
  encontreiro,
  labelEquipeUser,
}: EncontreiroEquipeTableRowProps) {
  const [open, setOpen] = useState(false)

  const nomeCompleto = `${encontreiro.nome} ${encontreiro.sobrenome}`

  const colorFichaPreenchida = encontreiro.fichaPreenchida
    ? 'bg-emerald-500'
    : 'bg-red-500'
  const fichaPreenchida = encontreiro.fichaPreenchida ? 'Sim' : 'Não'

  const isRosa = labelPertenceARosa(encontreiro.equipeLabel)
  const isSala = labelPertenceASala(encontreiro.equipeLabel)

  const showAction = false

  const isCoord = (
    isRosa
      ? encontreiro.equipeLabel === labelEquipeUser
      : (encontreiro.coordena &&
          !isSala &&
          encontreiro.equipeLabel !== 'Dirigente') ||
        encontreiro.equipeLabel === 'Apresentação'
  )
    ? 'font-bold'
    : ''

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TableRow className={cn(isCoord, 'items-center bg-white')}>
        <TableCell className="font-medium text-nowrap">
          {encontreiro.numeroEncontro}
        </TableCell>
        <TableCell>
          {nomeCompleto} {encontreiro.apelido && `(${encontreiro.apelido})`}
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
        <TableCell
          className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
          title={encontreiro.email || ''}
        >
          {encontreiro.email}
        </TableCell>
        <TableCell
          className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
          title={encontreiro.email || ''}
        >
          {encontreiro.equipeLabel}
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                colorFichaPreenchida,
                'size-3 rounded-full shadow-sm',
              )}
            />
            <span className="text-xs">{fichaPreenchida}</span>
          </div>
        </TableCell>
        {showAction && (
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
        )}
      </TableRow>
    </AlertDialog>
  )
}
