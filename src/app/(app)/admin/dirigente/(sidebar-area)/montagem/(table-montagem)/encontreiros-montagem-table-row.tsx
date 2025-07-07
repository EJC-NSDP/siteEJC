import { Check, CircleOff, ScanSearch } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import type { EncontreiroMontagemSummaryData } from '@/app/api/encontreiro/montagem/get-montagem-summary'
import { AlertDialogGenericContent } from '@/components/Dialog/AlertDialogGenericContent'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/lib/axios'
import { getInitials } from '@/utils/get-initials'
import { idPertenceARosa, idPertenceASala } from '@/utils/pertence'
import { useState } from 'react'
import { EncontreiroMontagemCoord } from './EncontreiroMontagemCoord'
import { EncontreiroMontagemEquipe } from './EncontreiroMontagemEquipe'

interface EncontreiroTableRowProps {
  encontreiro: EncontreiroMontagemSummaryData
}

export async function resetPassword(encontreiroId: string) {
  // await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000))

  return await api.patch(`encontreiro/${encontreiroId}/reset-password`)
}

function canBeCoord(equipeValue: string) {
  if (equipeValue === 'nao_participara' || equipeValue === 'select_equipe')
    return 'disabled'
  if (idPertenceARosa(equipeValue) || equipeValue === 'apresentacao')
    return 'mandatory'
  if (idPertenceASala(equipeValue)) return 'disabled'
  return 'enabled'
}

export function EncontreiroTableRow({ encontreiro }: EncontreiroTableRowProps) {
  const [open, setOpen] = useState(false)
  const [coordEnable, setCoordEnable] = useState(
    encontreiro.equipe ? canBeCoord(encontreiro.equipe.value) : 'disabled',
  )

  function updateCoordEnable(equipeValue: string) {
    setCoordEnable(canBeCoord(equipeValue))
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TableRow className="bg-white">
        <TableCell className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="size-10">
              <AvatarImage
                src={encontreiro.avatarUrl || undefined}
                className="transition-opacity duration-300 group-hover:opacity-50"
              />
              <AvatarFallback>{getInitials(encontreiro.nome)}</AvatarFallback>
            </Avatar>
            <span className="text-nowrap text-center text-xs text-zinc-600">
              {encontreiro.encontro}º EJC
            </span>
          </div>
          <span className="text-zinc-800">{encontreiro.nome}</span>
        </TableCell>
        <TableCell>{encontreiro.bairro}</TableCell>
        <TableCell>
          {encontreiro.disponibilidade === ''
            ? 'Não preencheu'
            : encontreiro.disponibilidade}
        </TableCell>
        <TableCell>
          <div className="flex flex-col items-center gap-2 text-left">
            {encontreiro.preferencias.map((preferencias, index) => {
              return (
                <span className="w-full text-xs" key={index}>
                  {preferencias}
                </span>
              )
            })}
          </div>
        </TableCell>
        <TableCell>
          <EncontreiroMontagemEquipe
            idEncontreiro={encontreiro.id}
            valueEquipe={encontreiro.equipe ? encontreiro.equipe.value : null}
            changeCoordStatus={updateCoordEnable}
          />
        </TableCell>
        <TableCell>
          {coordEnable === 'enabled' && encontreiro.equipe ? (
            <EncontreiroMontagemCoord
              idEncontreiro={encontreiro.id}
              coordStatus={encontreiro.equipe.coordenando}
            />
          ) : coordEnable === 'disabled' ? (
            <CircleOff className="size-4 text-zinc-300" />
          ) : (
            <Check className="size-4 text-primary/80" />
          )}
        </TableCell>
        <TableCell>
          <AlertDialogTrigger asChild title="Explorar encontreiro">
            <Button variant="outline" className="border-primary/80">
              <ScanSearch className="size-5 text-primary" />
            </Button>
          </AlertDialogTrigger>
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
