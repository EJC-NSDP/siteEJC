import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import type { EncontreiroSummaryData } from '@/app/api/encontreiro/get-encontreiros-summary'
import { EncontreiroMontagemStatus } from '@/components/Table/EncontreiroMontagemStatus'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { getColor } from '@/utils/fetch-color'
import Link from 'next/link'
import { useState } from 'react'

interface EncontreiroTableRowProps {
  encontreiro: EncontreiroSummaryData
}

export function EncontreiroTableRow({ encontreiro }: EncontreiroTableRowProps) {
  const [open, setOpen] = useState(false)

  const nomeCompleto = `${encontreiro.nome} ${encontreiro.sobrenome}`

  const statusMontagem =
    encontreiro.statusMontagem === 'INATIVO' ? 'INATIVO' : 'ATIVO'

  const corCirculo = getColor(encontreiro.circulo.cor)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TableRow className="bg-white">
        <TableCell className="text-nowrap pl-4 font-medium">
          {encontreiro.numeroEncontro}
        </TableCell>
        <TableCell className="text-nowrap">{nomeCompleto}</TableCell>
        <TableCell>{encontreiro.bairro}</TableCell>
        <TableCell>{encontreiro.celular}</TableCell>
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
          <Link href={`/admin/dirigente/${encontreiro.slug}/edit`}>
            <Button variant="ghost" className="p-0">
              <Pencil className="h-4 w-4 text-zinc-400 hover:text-zinc-500" />
            </Button>
          </Link>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Trash2 className="h-4 w-4 text-red-400 hover:text-red-500" />
            </Button>
          </AlertDialogTrigger>
        </TableCell>
      </TableRow>

      {/* <DeleteDialog
        idEncontreiro={encontreiro.id}
        nomeEncontreiro={`${encontreiro.nome} ${encontreiro.sobrenome}`}
        openFn={setOpen}
      /> */}
    </AlertDialog>
  )
}
