'use client'

import type { PalestraEncontro } from '@/app/api/encontro/atual/[ignorar]/palestrantes/get-palestrantes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { CardPalestra } from './CardPalestra'

const palestraScheme = z.object({
  idPalestra: z.string().min(1, 'Informe a palestra'),
  nomePalestrante: z.string().min(1, 'Informe o nome do palestrante'),
})

const palestrasEncontroScheme = z.object({
  palestras: z.array(palestraScheme),
})

type palestraData = z.infer<typeof palestraScheme>
export type PalestrasData = z.infer<typeof palestrasEncontroScheme>

interface PalestraFormProps {
  palestras: PalestraEncontro[]
}

export default function PalestraForm({ palestras }: PalestraFormProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const form = useForm<PalestrasData>({
    resolver: zodResolver(palestrasEncontroScheme),
    defaultValues: {
      palestras: palestras as palestraData[],
    },
  })

  const { control, handleSubmit } = form

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'palestras',
  })

  function addPalestra() {
    append({
      idPalestra: '',
      nomePalestrante: '',
    })
  }

  function moveUp(index: number) {
    if (index > 0) {
      move(index, index - 1)
    }
  }

  function moveDown(index: number) {
    if (index < fields.length - 1) {
      move(index, index + 1)
    }
  }

  async function handleUpdatePalestras(formData: PalestrasData) {
    setIsUpdating(true)
    const result = await api.put('encontro/atual/1/palestrantes', formData)

    if (result.status === 201) {
      toast.success('Palestras atualizados!')
    } else {
      toast.error('Erro ao atualizar os palestrantes.')
    }

    setIsUpdating(false)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(handleUpdatePalestras)}
        className="space-y-4 lg:space-y-2"
      >
        {fields.length === 0 && (
          <Card className="flex w-full items-center justify-center gap-4 p-4 text-center text-zinc-500">
            Palestras não cadastradas. Adicione abaixo.
          </Card>
        )}
        {fields.map((field, index) => (
          <CardPalestra
            key={field.id}
            index={index}
            total={fields.length}
            remove={() => remove(index)}
            moveUp={() => moveUp(index)}
            moveDown={() => moveDown(index)}
          />
        ))}

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            onClick={addPalestra}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="size-4 text-tertiary" />
            Adicionar Palestra
          </Button>
          <Button type="submit" disabled={isUpdating}>
            Salvar
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
