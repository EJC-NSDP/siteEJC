'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const pastoralScheme = z.object({
  idPessoa: z.string({ required_error: 'A pessoa é obrigatória.' }),
  idFuncao: z.string({ required_error: 'A função é obrigatória.' }),
  ano: z.string(),
})

export type PastoralData = z.infer<typeof pastoralScheme>

interface AdicionarPastoralFormProps {
  sheet?: boolean
}

export function AdicionarPastoralForm({
  sheet = false,
}: AdicionarPastoralFormProps) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const thisYear = new Date().getFullYear()

  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<PastoralData>({
    resolver: zodResolver(pastoralScheme),
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

  async function handleAssignPastoral(formDataInput: PastoralData) {
    setIsUpdating(true)
    const pastoral = await api.post('lideranca', formDataInput)

    if (pastoral.status === 201) {
      setIsUpdating(false)
      queryClient.invalidateQueries({
        queryKey: ['pastorais', parseInt(formDataInput.ano, 10)],
      })
      if (sheet) {
        router.back()
      } else {
        router.replace('/admin/secretaria/pastorais')
      }
    } else {
      setIsUpdating(false)
      toast.error('Erro ao adicionar esse encontreiro a pastoral.')
    }
  }

  return (
    <FormProvider {...form}>
      <form id="addPastoralForm" onSubmit={handleSubmit(handleAssignPastoral)}>
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
              name="idFuncao"
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
              Adicionar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
