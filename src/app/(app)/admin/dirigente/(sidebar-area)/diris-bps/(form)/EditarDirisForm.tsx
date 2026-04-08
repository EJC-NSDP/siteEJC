'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { Diri } from '@/app/api/lideranca/[ano]/dirigentes/get-dirigentes'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { api } from '@/lib/axios'
import { getEncontreiros } from '@/utils/fetch-domains'

// Busca dons e pastas — ajuste os paths conforme seus utils
async function getDons(): Promise<SelectArray[]> {
  const res = await api.get('domains/dons')
  return res.data
}

async function getPastas(): Promise<SelectArray[]> {
  const res = await api.get('domains/pastas')
  return res.data
}

async function getDirigentesByAno(ano: number) {
  const res = await api.get(`lideranca/${ano}/dirigentes`)
  const data: Diri[] = res.data
  return data
}

// ---

const dirigenteRowScheme = z.object({
  idPessoa: z.string({ required_error: 'Selecione um encontreiro.' }),
  idDom: z.string({ required_error: 'Selecione um dom.' }),
  idPasta: z.string({ required_error: 'Selecione uma pasta.' }),
})

const dirigenteFormScheme = z.object({
  ano: z.number(),
  dirigentes: z
    .array(dirigenteRowScheme)
    .min(1, 'Adicione ao menos um dirigente.'),
})

export type DirigenteFormData = z.infer<typeof dirigenteFormScheme>

interface EditarDirigenteFormProps {
  sheet?: boolean
}

export function EditarDirigenteForm({
  sheet = false,
}: EditarDirigenteFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const thisYear = new Date().getFullYear()

  const [isAnoAtual, setIsAnoAtual] = useState(false)
  const [isLoadingAno, setIsLoadingAno] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<DirigenteFormData>({
    resolver: zodResolver(dirigenteFormScheme),
    defaultValues: {
      ano: thisYear,
      dirigentes: Array.from({ length: 5 }, () => ({
        idPessoa: '',
        idDom: '',
        idPasta: '',
      })),
    },
  })

  const { handleSubmit, control, reset } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dirigentes',
  })

  const { data: encontreiros } = useQuery<SelectArray[]>({
    queryFn: getEncontreiros,
    queryKey: ['encontreiros'],
  })

  const { data: dons } = useQuery<SelectArray[]>({
    queryFn: getDons,
    queryKey: ['dons'],
  })

  const { data: pastas } = useQuery<SelectArray[]>({
    queryFn: getPastas,
    queryKey: ['pastas'],
  })

  useEffect(() => {
    async function handleAnoSwitch() {
      setIsLoadingAno(true)
      try {
        const dirigentesAtuais = await getDirigentesByAno(thisYear)

        if (isAnoAtual) {
          if (dirigentesAtuais.length > 0) {
            reset({
              ano: dirigentesAtuais[0].ano,
              dirigentes: dirigentesAtuais.map((d) => ({
                idPessoa: d.id,
                idDom: d.dom ?? '',
                idPasta: d.pasta ?? '',
              })),
            })
          } else {
            reset({
              ano: thisYear,
              dirigentes: Array.from({ length: 5 }, () => ({
                idPessoa: '',
                idDom: '',
                idPasta: '',
              })),
            })
          }
        } else {
          const nextAno =
            dirigentesAtuais.length > 0
              ? dirigentesAtuais[0].ano + 1
              : thisYear + 1

          reset({
            ano: nextAno,
            dirigentes: Array.from({ length: 5 }, () => ({
              idPessoa: '',
              idDom: '',
              idPasta: '',
            })),
          })
        }
      } catch {
        reset({
          ano: isAnoAtual ? thisYear : thisYear + 1,
          dirigentes: Array.from({ length: 5 }, () => ({
            idPessoa: '',
            idDom: '',
            idPasta: '',
          })),
        })
      } finally {
        setIsLoadingAno(false)
      }
    }

    handleAnoSwitch()
  }, [isAnoAtual, reset, thisYear])

  async function handleSubmitDirigentes(formDataInput: DirigenteFormData) {
    setIsUpdating(true)
    try {
      if (isAnoAtual) {
        await api.put(`lideranca/${formDataInput.ano}/dirigentes`, {
          dirigentes: formDataInput.dirigentes,
        })
      } else {
        await api.post(`lideranca/${formDataInput.ano}/dirigentes`, {
          dirigentes: formDataInput.dirigentes,
        })
      }

      queryClient.invalidateQueries({ queryKey: ['dirigentes'] })
      toast.success('Dirigentes salvos com sucesso!')

      if (sheet) {
        router.back()
      } else {
        router.replace('/admin/dirigente/diris-bps')
      }
    } catch {
      toast.error('Erro ao salvar os dirigentes.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form
        id="editDirigenteForm"
        onSubmit={handleSubmit(handleSubmitDirigentes)}
      >
        <Card className="w-full space-y-8 p-8 text-zinc-700">
          <CardContent className="flex w-full flex-col gap-8 p-0">
            {/* Switch ano */}
            <div className="flex items-center gap-4">
              <Switch
                id="ano-switch"
                checked={isAnoAtual}
                onCheckedChange={setIsAnoAtual}
                disabled={isLoadingAno}
              />
              <Label htmlFor="ano-switch" className="text-base">
                {isAnoAtual
                  ? `Editando dirigentes de ${thisYear}`
                  : `Criando dirigentes para o próximo ano`}
              </Label>
            </div>

            {/* Grid de dirigentes */}
            <div className="flex flex-col gap-4">
              {isLoadingAno ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                // <p className="text-sm text-zinc-400">Carregando...</p>
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-4 rounded-lg border border-zinc-200 p-4 lg:grid-cols-[1fr_1fr_1fr_auto]"
                  >
                    <FormField
                      control={control}
                      name={`dirigentes.${index}.idPessoa`}
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

                    <FormField
                      control={control}
                      name={`dirigentes.${index}.idDom`}
                      render={({ field: f }) => (
                        <SelectGroupInput
                          label="Dom"
                          placeholder="Selecione"
                          onChange={f.onChange}
                          value={f.value}
                        >
                          {dons?.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              text={item.label}
                            />
                          ))}
                        </SelectGroupInput>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`dirigentes.${index}.idPasta`}
                      render={({ field: f }) => (
                        <SelectGroupInput
                          label="Pasta"
                          placeholder="Selecione"
                          onChange={f.onChange}
                          value={f.value}
                        >
                          {pastas?.map((item) => (
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
                onClick={() => append({ idPessoa: '', idDom: '', idPasta: '' })}
                disabled={isLoadingAno}
              >
                + Adicionar dirigente
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex w-full justify-end gap-4 p-0">
            <Button
              type="submit"
              className="h-10 w-40"
              disabled={isUpdating || isLoadingAno}
            >
              {isUpdating ? 'Salvando...' : isAnoAtual ? 'Atualizar' : 'Criar'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
