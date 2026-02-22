'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { PessoaPastoral } from '@/app/api/lideranca/[ano]/pastorais/get-pastorais'
import { DeleteGenericDialog } from '@/components/Table/DeleteGenericDialog'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
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
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TableRow className="items-center bg-white">
        <TableCell className="font-medium text-nowrap">{pessoa.nome}</TableCell>
        <TableCell>{pessoa.pastoral}</TableCell>
        <TableCell className="flex justify-center gap-2">
          <AlertDialogTrigger asChild title="Remover da Pastoral">
            <Button variant="ghost" className="p-0">
              <Trash2 className="size-4 text-red-400 hover:text-red-500" />
            </Button>
          </AlertDialogTrigger>
        </TableCell>
      </TableRow>

      <DeleteGenericDialog
        id={pessoa.id}
        deleteFn={deletePastoral}
        openFn={setOpen}
      >
        <span>
          Tem certeza que deseja remover{' '}
          <span className="font-bold">{pessoa.nome}</span> da {pessoa.pastoral}?
        </span>
      </DeleteGenericDialog>
    </AlertDialog>
  )
}
