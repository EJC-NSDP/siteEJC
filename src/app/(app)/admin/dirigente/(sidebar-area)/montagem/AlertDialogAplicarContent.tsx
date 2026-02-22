import { useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'

import type { DivulgarMontagem } from '@/app/api/montagem/divulgar/divulgarMontagem'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { api } from '@/lib/axios'

interface AlertDialogAplicarContentProps {
  openFn: Dispatch<SetStateAction<boolean>>
}

async function divulgarMontagem(): Promise<DivulgarMontagem> {
  return (await api.put('montagem/divulgar')).data
}

export function AlertDialogAplicarContent({
  openFn,
}: AlertDialogAplicarContentProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleAction() {
    setIsUpdating(true)

    return divulgarMontagem()
  }
  return (
    <AlertDialogContent className="w-80">
      <AlertDialogHeader className="flex flex-col gap-2">
        <AlertDialogTitle>Atenção!</AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-4">
          Você está prestes a divulgar a montagem dando os devidos acessos a
          cada pessoa que está nesta página e dizendo a equipe deles no
          encontrão. <strong>Tem certeza que deseja continuar?</strong>
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isUpdating}
            className="disabled:cursor-wait disabled:opacity-50"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isUpdating}
            className="disabled:cursor-wait disabled:opacity-50"
            onClick={(event) => {
              event.preventDefault()
              handleAction().then((result) => {
                if (result.montagem.atualizados > 0) {
                  toast.success(
                    `${result.montagem.atualizados} encontreiros atualizados.`,
                  )
                }
                if (result.montagem.deletados > 0) {
                  toast.success(
                    `${result.montagem.deletados} encontreiros removidos desse Encontrão.`,
                  )
                }
                toast(
                  <div className="flex flex-col gap-1">
                    <span>Externa: {result.roles.externa}</span>
                    <span>Secretaria: {result.roles.secretaria}</span>
                    <span>Tios Secretos: {result.roles.tiosSecretos}</span>
                    <span>Coordenadores: {result.roles.coordenadores}</span>
                  </div>,
                )
                setIsUpdating(false)
                openFn(false)
              })
            }}
          >
            Divulgar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogHeader>
    </AlertDialogContent>
  )
}
