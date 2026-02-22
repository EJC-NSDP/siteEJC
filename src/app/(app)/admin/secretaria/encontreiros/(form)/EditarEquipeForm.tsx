'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { EncontreiroSecreSummaryData } from '@/app/api/secretaria/encontreiro/get-encontreiros-secre'
import { DisabledInput } from '@/components/Form/DisabledInput'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form'
import { api } from '@/lib/axios'
import { getEquipes } from '@/utils/fetch-domains'
import { idPertenceATropa } from '@/utils/pertence'

const editEquipeScheme = z.object({
  idPessoa: z.string({ required_error: 'A pessoa é obrigatória.' }),
  equipeLabel: z.string({ required_error: 'A equipe é obrigatória.' }),
})

export type EditEquipeData = z.infer<typeof editEquipeScheme>

interface EditEquipeFormProps {
  data: EncontreiroSecreSummaryData
  openFnAction: Dispatch<SetStateAction<boolean>>
}

export function EditarEquipeForm({ data, openFnAction }: EditEquipeFormProps) {
  const queryClient = useQueryClient()

  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<EditEquipeData>({
    resolver: zodResolver(editEquipeScheme),
    defaultValues: {
      idPessoa: data.id,
      equipeLabel: data.equipe,
    },
  })

  const { handleSubmit, control } = form

  const { data: equipes } = useQuery<SelectArray[]>({
    queryFn: async () => await getEquipes(),
    queryKey: ['equipes'],
  })

  async function handleEditEquipe(formDataInput: EditEquipeData) {
    setIsUpdating(true)
    const equipe = await api.patch(
      `secretaria/encontreiro/equipe/edit`,
      formDataInput,
    )
    if (equipe.status === 201) {
      setIsUpdating(false)
      queryClient.invalidateQueries({
        queryKey: ['encontreiros'],
      })
      toast.success('Equipe alterada.')
      openFnAction(false)
    } else {
      toast.error('Erro ao editar a equipe desse encontreiro.')
    }
    setIsUpdating(false)
  }

  return (
    <DialogContent className="flex w-80 flex-col gap-4 p-4">
      <FormProvider {...form}>
        <form id="editarEquipeForm" onSubmit={handleSubmit(handleEditEquipe)}>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>Editar equipe neste encontro</DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              <DisabledInput
                label="Encontreiro"
                value={`${data.nome} ${data.sobrenome}`}
              />
              <DisabledInput label="Equipe antiga" value={data.equipe} />
              <FormField
                control={control}
                name="equipeLabel"
                defaultValue={data.equipe ?? ''}
                render={({ field }) => {
                  return (
                    <SelectGroupInput
                      label="Nova equipe"
                      onChange={field.onChange}
                      value={field.value}
                    >
                      {equipes &&
                        equipes.map((item) => {
                          if (idPertenceATropa(item.value)) {
                            return (
                              <SelectItem
                                key={item.value}
                                value={item.label}
                                text={item.label}
                              />
                            )
                          }
                          return null
                        })}
                    </SelectGroupInput>
                  )
                }}
              />
              <Button
                type="submit"
                disabled={isUpdating}
                className="disabled:cursor-wait disabled:opacity-50"
              >
                Atualizar
              </Button>
            </DialogDescription>
          </DialogHeader>
        </form>
      </FormProvider>
    </DialogContent>
  )
}
