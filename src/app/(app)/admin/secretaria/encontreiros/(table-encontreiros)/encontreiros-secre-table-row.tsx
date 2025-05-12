import { TableCell, TableRow } from '@/components/ui/table'

import type { EncontreiroSecreSummaryData } from '@/app/api/secretaria/encontreiro/get-encontreiros-secre'
import { DeleteGenericDialog } from '@/components/Table/DeleteGenericDialog'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { Trash2, UserLock, UserPen } from 'lucide-react'
import { useState } from 'react'
import { EditarEquipeForm } from '../(form)/EditarEquipeForm'

interface EncontreiroTableRowProps {
  encontreiro: EncontreiroSecreSummaryData
}

async function deleteEquipe(id: string) {
  await api.delete(`encontreiro/${id}/equipe/remove-encontro-atual`)
}

export function EncontreiroSecreTableRow({
  encontreiro,
}: EncontreiroTableRowProps) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const nomeCompleto = `${encontreiro.nome} ${encontreiro.sobrenome}`

  const colorFichaPreenchida = encontreiro.fichaPreenchida
    ? 'bg-emerald-500'
    : 'bg-red-500'
  const fichaPreenchida = encontreiro.fichaPreenchida ? 'Sim' : 'Não'

  const isCoord = encontreiro.coordena ? 'font-bold' : ''

  return (
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
              'size-3 rounded-full shadow-sm',
            )}
          />
          <span className="text-xs">{fichaPreenchida}</span>
        </div>
      </TableCell>
      <TableCell className="flex justify-center gap-2">
        {!encontreiro.coordena ? (
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild title="Editar equipe">
              <Button variant="ghost" className="p-0">
                <UserPen className="size-4 text-blue-400 hover:text-blue-500" />
              </Button>
            </DialogTrigger>
            <EditarEquipeForm data={encontreiro} openFnAction={setOpenEdit} />
          </Dialog>
        ) : (
          <Button
            variant="ghost"
            className="p-0"
            title="Coordenador bloqueado"
            disabled
          >
            <UserLock className="size-4 text-zinc-400" />
          </Button>
        )}

        {!encontreiro.coordena && (
          <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogTrigger asChild title="Remover desse Encontrão">
              <Button variant="ghost" className="p-0">
                <Trash2 className="size-4 text-red-400 hover:text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <DeleteGenericDialog
              id={encontreiro.id}
              deleteFn={deleteEquipe}
              openFn={setOpenDelete}
            >
              <span>
                Tem certeza que deseja remover{' '}
                <span className="font-bold">{encontreiro.nome}</span> da equipe
                de <span className="font-bold">{encontreiro.equipe}</span>?
              </span>
            </DeleteGenericDialog>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  )
}
