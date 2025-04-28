import { Pencil, RotateCcwKey } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import type { EncontreiroSummaryData } from '@/app/api/encontreiro/get-encontreiros-summary'
import { AlertDialogGenericContent } from '@/components/Dialog/AlertDialogGenericContent'
import { EncontreiroMontagemStatus } from '@/components/Table/EncontreiroMontagemStatus'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { getCirculoColor } from '@/utils/fetch-color'
import Link from 'next/link'
import { useState } from 'react'

interface EncontreiroTableRowProps {
  encontreiro: EncontreiroSummaryData
}

export async function resetPassword(encontreiroId: string) {
  // await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000))

  return await api.patch(`encontreiro/${encontreiroId}/reset-password`)
}

export function EncontreiroTableRow({ encontreiro }: EncontreiroTableRowProps) {
  const [open, setOpen] = useState(false)

  const nomeCompleto = `${encontreiro.nome} ${encontreiro.sobrenome}`

  const statusMontagem =
    encontreiro.statusMontagem === 'INATIVO' ? 'INATIVO' : 'ATIVO'

  const corCirculo = getCirculoColor(encontreiro.circulo.cor || '')

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TableRow className="bg-white">
        <TableCell className="text-nowrap pl-4 font-medium">
          {encontreiro.numeroEncontro}
        </TableCell>
        <TableCell className="text-nowrap">{nomeCompleto}</TableCell>
        <TableCell>{encontreiro.bairro}</TableCell>
        <TableCell
          className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
          title={encontreiro.email}
        >
          {encontreiro.email}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className={cn(corCirculo, 'size-3 rounded-full  shadow-sm')} />
            <span className="text-xs">{encontreiro.circulo.nome}</span>
          </div>
        </TableCell>
        <TableCell>
          <EncontreiroMontagemStatus
            status={statusMontagem}
            encontreiroId={encontreiro.id}
          />
        </TableCell>
        <TableCell className="flex gap-2 pr-4">
          <Link
            href={`/admin/dirigente/encontreiro/${encontreiro.slug}/edit`}
            title="Editar"
          >
            <Button variant="ghost" className="p-0">
              <Pencil className="size-4 text-zinc-400 hover:text-zinc-500" />
            </Button>
          </Link>
          {/* <Link
            href={`/admin/dirigente/encontreiro/${encontreiro.slug}/edit`}
            title="Resetar senha"
          >
            <Button variant="ghost" className="p-0">
              <RotateCcwKey className="size-4 text-zinc-400 hover:text-zinc-500" />
            </Button>
          </Link> */}

          <AlertDialogTrigger asChild title="Resetar senha">
            <Button variant="ghost" className="p-0">
              <RotateCcwKey className="size-4 text-blue-400 hover:text-blue-500" />
            </Button>
          </AlertDialogTrigger>
          {/* <AlertDialogTrigger asChild title="Deletar">
            <Button variant="ghost" className="p-0">
              <Trash2 className="size-4 text-red-400 hover:text-red-500" />
            </Button>
          </AlertDialogTrigger> */}
        </TableCell>
      </TableRow>

      <AlertDialogGenericContent
        idEncontreiro={encontreiro.id}
        actionButton="Resetar"
        openFn={setOpen}
        actionFn={resetPassword}
      >
        <span>
          Tem certeza que deseja resetar a senha de{' '}
          <span className="font-bold">{encontreiro.nome}</span>?
        </span>
      </AlertDialogGenericContent>
    </AlertDialog>
  )
}
