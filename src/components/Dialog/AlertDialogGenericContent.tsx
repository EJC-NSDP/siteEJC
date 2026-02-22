import { useQueryClient } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

interface AlertDialogGenericContentProps<
  T = string,
  R = AxiosResponse<unknown, unknown>,
> {
  idEncontreiro: string
  actionButton: string
  children: ReactNode
  openFn: Dispatch<SetStateAction<boolean>>
  actionFn: (value: T) => Promise<R>
}

export function AlertDialogGenericContent({
  idEncontreiro,
  actionButton,
  children,
  openFn,
  actionFn,
}: AlertDialogGenericContentProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()

  async function handleAction() {
    setIsUpdating(true)
    await actionFn(idEncontreiro).then(async () => {
      await queryClient.refetchQueries()
      setIsUpdating(false)
    })
  }
  return (
    <AlertDialogContent className="w-80">
      <AlertDialogHeader className="flex flex-col gap-2">
        <AlertDialogTitle>Atenção!</AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-4">
          {children}
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
              handleAction().then(() => openFn(false))
              event.preventDefault()
            }}
          >
            {actionButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogHeader>
    </AlertDialogContent>
  )
}
