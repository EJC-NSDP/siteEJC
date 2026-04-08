'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { api } from '@/lib/axios'
import { getEncontreiros, getFuncoes } from '@/utils/fetch-domains'

const dirisScheme = z.object({
  idPessoa: z.string({ required_error: 'A pessoa é obrigatória.' }),
  idPasta: z.string({ required_error: 'A pasta é obrigatória.' }),
  idDom: z.string({ required_error: 'O dom é obrigatório.' }),
  ano: z.string(),
})

export type DirisData = z.infer<typeof dirisScheme>

interface EditarDirisFormProps {
  sheet?: boolean
}

export function EditarBPsForm({ sheet = false }: EditarDirisFormProps) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const thisYear = new Date().getFullYear()

  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<DirisData>({
    resolver: zodResolver(dirisScheme),
  })

  const { handleSubmit, control } = form

  const { data: encontreiros } = useQuery<SelectArray[]>({
    queryFn: async () => await getEncontreiros(),
    queryKey: ['encontreiros'],
  })

  const { data: funcoes } = useQuery<SelectArray[]>({
    queryFn: async () => await getFuncoes(),
    queryKey: ['funcoes'],
  })

  async function handleAssignDirigencia(formDataInput: DirisData) {
    setIsUpdating(true)
    const dirigentes = await api.post('lideranca', formDataInput)

    if (dirigentes.status === 201) {
      setIsUpdating(false)
      queryClient.invalidateQueries({
        queryKey: ['dirigentes', parseInt(formDataInput.ano, 10)],
      })
      if (sheet) {
        router.back()
      } else {
        router.replace('/admin/dirigente/diris-bps')
      }
    } else {
      setIsUpdating(false)
      toast.error('Erro ao adicionar esse encontreiro aos dirigentes.')
    }
  }

  return (
    <FormProvider {...form}>
      <form
        id="editDirigenteForm"
        onSubmit={handleSubmit(handleAssignDirigencia)}
      >
        <Card className="w-full space-y-8 p-8 text-zinc-700">
          <CardContent className="flex w-full flex-col gap-8 p-0">
            <FormField
              control={control}
              name="ano"
              defaultValue={thisYear.toString()}
              render={() => {
                return <></>
              }}
            />
            <FormField
              control={control}
              name="idPessoa"
              render={({ field }) => {
                return (
                  <SelectGroupInput
                    label="Encontreiro"
                    placeholder="Selecione um encontreiro"
                    onChange={field.onChange}
                    value={field.value}
                  >
                    {encontreiros &&
                      encontreiros.map((item) => {
                        return (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            text={item.label}
                          />
                        )
                      })}
                  </SelectGroupInput>
                )
              }}
            />
            <FormField
              control={control}
              name="idDom"
              render={({ field }) => {
                return (
                  <SelectGroupInput
                    label="Pastoral"
                    placeholder="Selecione uma Pastoral"
                    onChange={field.onChange}
                    value={field.value}
                  >
                    {funcoes &&
                      funcoes.map((item) => {
                        return (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            text={item.label}
                          />
                        )
                      })}
                  </SelectGroupInput>
                )
              }}
            />
          </CardContent>
          <CardFooter className="flex w-full justify-end gap-8 p-0">
            <Button type="submit" className="h-10 w-40" disabled={isUpdating}>
              Salvar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
