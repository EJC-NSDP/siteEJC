'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'
import { z } from 'zod'

import { DisabledInput } from '@/components/Form/DisabledInput'
import { TextInput } from '@/components/Form/TextInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/axios'
import { getCEPData, type CEPResponse } from '@/utils/fetch-cep'

import type { LocalOption } from './EncontroForm'

const novoLocalSchema = z.object({
  nomeLocal: z.string().min(1, 'Informe o nome do local'),
  numeroLocal: z.string().min(1, 'Informe o número do local'),
  enderecoCep: z.string().min(9, 'CEP inválido'),
})

type NovoLocalFormData = z.infer<typeof novoLocalSchema>

type Endereco = {
  rua: string
  bairro: string
  cidade: string
  estado: string
}

type Props = {
  onLocalCriadoAction: (local: LocalOption) => void
}

export function NovoLocalModal({ onLocalCriadoAction }: Props) {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [enderecoFetched, setEnderecoFetched] = useState<Endereco | null>(null)

  const form = useForm<NovoLocalFormData>({
    resolver: zodResolver(novoLocalSchema),
    defaultValues: { nomeLocal: '', numeroLocal: '', enderecoCep: '' },
  })

  const { handleSubmit, control, register, watch, reset } = form

  const registerWithMask = useHookFormMask(register)

  const cepValue = watch('enderecoCep')

  useEffect(() => {
    async function fetchAddress(cep: string) {
      const res = await getCEPData(cep)
      if (res) {
        const data: CEPResponse = await res.json()
        setEnderecoFetched({
          rua: data.street,
          bairro: data.neighborhood,
          cidade: data.city,
          estado: data.state,
        })
      } else {
        setEnderecoFetched(null)
      }
    }

    const rawCep = cepValue?.replace(/\D/g, '')
    if (rawCep?.length === 8) {
      fetchAddress(rawCep)
    } else {
      setEnderecoFetched(null)
    }
  }, [cepValue])

  async function onSubmit(data: NovoLocalFormData) {
    setIsCreating(true)
    try {
      const { data: novoLocal } = await api.post('encontro/local', data)
      onLocalCriadoAction({
        id: novoLocal.id,
        nomeLocal: novoLocal.nomeLocal,
        numeroLocal: novoLocal.numeroLocal,
        enderecoCep: novoLocal.enderecoCep,
        endereco: enderecoFetched ?? undefined,
      })
      reset()
      setEnderecoFetched(null)
      setOpen(false)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="xs" variant="outline" className="gap-1.5">
          <Plus className="size-3.5" />
          Novo Local
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Local</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 pt-2"
          >
            <FormField
              control={control}
              name="nomeLocal"
              render={({ field }) => (
                <TextInput label="Nome do Local *">
                  <Input
                    {...field}
                    placeholder="Ex.: Colégio Divina Providência"
                    autoFocus
                  />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="numeroLocal"
              render={({ field }) => (
                <TextInput label="Número *">
                  <Input {...field} placeholder="Ex.: 123" />
                </TextInput>
              )}
            />
            <FormField
              control={control}
              name="enderecoCep"
              render={({ field }) => (
                <TextInput label="CEP *">
                  <Input
                    {...field}
                    {...registerWithMask(field.name, '99999-999')}
                    placeholder="00000-000"
                  />
                </TextInput>
              )}
            />

            {enderecoFetched && (
              <div className="grid grid-cols-2 gap-3">
                <DisabledInput label="Rua" value={enderecoFetched.rua} />
                <DisabledInput label="Bairro" value={enderecoFetched.bairro} />
                <DisabledInput label="Cidade" value={enderecoFetched.cidade} />
                <DisabledInput label="Estado" value={enderecoFetched.estado} />
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating || !enderecoFetched}>
                {isCreating ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
