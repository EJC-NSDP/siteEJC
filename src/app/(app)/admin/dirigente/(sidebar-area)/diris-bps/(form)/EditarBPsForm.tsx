'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { BP } from '@/app/api/lideranca/[ano]/bps/get-bps'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/axios'
import { getEncontreiros } from '@/utils/fetch-domains'

async function getBPsByAno(ano: number) {
  const res = await api.get(`lideranca/${ano}/bps`)
  const data: BP[] = res.data
  return data
}

// ---

const bpRowScheme = z.object({
  idPessoa: z.string({ required_error: 'Selecione um encontreiro.' }),
})

const bpFormScheme = z.object({
  ano: z.number(),
  bps: z.array(bpRowScheme).min(1, 'Adicione ao menos um BP.'),
})

export type BPFormData = z.infer<typeof bpFormScheme>

interface EditarBPsFormProps {
  sheet?: boolean
}

export function EditarBPsForm({ sheet = false }: EditarBPsFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const thisYear = new Date().getFullYear()

  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<BPFormData>({
    resolver: zodResolver(bpFormScheme),
    defaultValues: {
      ano: thisYear,
      bps: Array.from({ length: 2 }, () => ({ idPessoa: '' })),
    },
  })

  const { handleSubmit, control, reset } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bps',
  })

  const { data: encontreiros } = useQuery<SelectArray[]>({
    queryFn: getEncontreiros,
    queryKey: ['encontreiros'],
  })

  useEffect(() => {
    async function handleAnoSwitch() {
      setIsLoading(true)
      try {
        const bpsAtuais = await getBPsByAno(thisYear)

        if (bpsAtuais.length > 0) {
          reset({
            ano: bpsAtuais[0].ano,
            bps: bpsAtuais.map((d) => ({
              idPessoa: d.id,
            })),
          })
        } else {
          reset({
            ano: thisYear,
            bps: Array.from({ length: 4 }, () => ({ idPessoa: '' })),
          })
        }
      } catch {
        reset({
          ano: thisYear,
          bps: Array.from({ length: 4 }, () => ({ idPessoa: '' })),
        })
      } finally {
        setIsLoading(false)
      }
    }

    handleAnoSwitch()
  }, [reset, thisYear])

  async function handleSubmitBPs(formDataInput: BPFormData) {
    setIsUpdating(true)
    try {
      await api.put(`lideranca/${formDataInput.ano}/bps`, {
        bps: formDataInput.bps,
      })

      queryClient.invalidateQueries({ queryKey: ['bps'] })
      toast.success('BPs salvos com sucesso!')

      if (sheet) {
        router.back()
      } else {
        router.replace('/admin/dirigente/diris-bps')
      }
    } catch {
      toast.error('Erro ao salvar os BPs.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form id="editBPsForm" onSubmit={handleSubmit(handleSubmitBPs)}>
        <Card className="w-full space-y-8 p-8 text-zinc-700">
          <CardContent className="flex w-full flex-col gap-8 p-0">
            {/* Lista de BPs */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 p-4 lg:grid-cols-[1fr_auto]"
                  >
                    <FormField
                      control={control}
                      name={`bps.${index}.idPessoa`}
                      render={({ field: f }) => (
                        <SelectGroupInput
                          label="Encontreiro"
                          placeholder="Selecione"
                          onChange={f.onChange}
                          value={f.value}
                        >
                          {encontreiros?.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              text={item.label}
                            />
                          ))}
                        </SelectGroupInput>
                      )}
                    />

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-red-500"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() => append({ idPessoa: '' })}
                disabled={isLoading}
              >
                + Adicionar BP
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex w-full justify-end gap-4 p-0">
            <Button
              type="submit"
              className="h-10 w-40"
              disabled={isUpdating || isLoading}
            >
              {isUpdating ? 'Salvando...' : 'Atualizar'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
