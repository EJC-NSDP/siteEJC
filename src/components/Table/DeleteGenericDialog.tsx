import { useQueryClient } from '@tanstack/react-query'
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

interface DeleteProps {
  id: string
  children: ReactNode
  openFn: Dispatch<SetStateAction<boolean>>
  deleteFn: (id: string) => Promise<void>
}

export function DeleteGenericDialog({
  id,
  children,
  openFn,
  deleteFn,
}: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  async function handleDelete() {
    setIsDeleting(true)
    await deleteFn(id).then(async () => {
      await queryClient.refetchQueries()
      setIsDeleting(false)
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
            disabled={isDeleting}
            className="disabled:cursor-wait disabled:opacity-50"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            className="disabled:cursor-wait disabled:opacity-50"
            onClick={(event) => {
              handleDelete().then(() => openFn(false))
              event.preventDefault()
            }}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogHeader>
    </AlertDialogContent>
  )
}
