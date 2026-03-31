'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { TemasEncontroData } from '@/app/api/encontro/atual/[ignorar]/temas/get-temas'
import { TextInput } from '@/components/Form/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/axios'

interface TemasFormProps {
  data: TemasEncontroData
}

const temasFormSchema = z.object({
  temaFantasia: z
    .string({ required_error: 'O tema fantasia é obrigatório.' })
    .min(1, { message: 'O tema fantasia é obrigatório.' }),
  temaEspiritual: z
    .string({ required_error: 'O tema espiritual é obrigatório.' })
    .min(1, { message: 'O tema espiritual é obrigatório.' }),
})

export type TemasFormDataInput = z.infer<typeof temasFormSchema>

export function TemasForm({ data }: TemasFormProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<TemasFormDataInput>({
    resolver: zodResolver(temasFormSchema),
    defaultValues: {
      temaFantasia: data?.temaFantasia ?? '',
      temaEspiritual: data?.temaEspiritual ?? '',
    },
  })

  const { handleSubmit, control } = form

  async function handleSaveTemas(formData: TemasFormDataInput) {
    setIsSaving(true)
    try {
      await api.put('encontro/atual/1/temas', formData)
      toast.success('Temas salvos com sucesso!')
    } catch {
      toast.error('Erro ao salvar os temas. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleSaveTemas)}>
        <div className="flex flex-col gap-6">
          <Card className="p-4">
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
              <FormField
                control={control}
                name="temaFantasia"
                render={({ field }) => (
                  <TextInput label={'Tema Fantasia *'}>
                    <Input autoFocus type="text" {...field} />
                  </TextInput>
                )}
              />
              <FormField
                control={control}
                name="temaEspiritual"
                render={({ field }) => (
                  <TextInput label={'Tema Espiritual *'}>
                    <Input autoFocus type="text" {...field} />
                  </TextInput>
                )}
              />
            </div>
          </Card>

          <Card className="w-full px-3 pt-8 text-zinc-700">
            <CardContent className="w-full">
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-bold lg:text-nowrap">
                  Atualizar Temas
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
                <div className="px-0 py-5 text-lg lg:py-7">
                  Lembre-se de salvar qualquer mudança realizada nessa página.
                </div>
                <div className="flex items-center justify-end gap-5 px-0 py-5 text-lg lg:flex-row lg:gap-7 lg:py-7">
                  <Button
                    type="submit"
                    className="h-10 w-40"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Atualizando...' : 'Atualizar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
  )
}
