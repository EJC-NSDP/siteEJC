'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { CardForm } from '@/components/Form/CardForm'
import { CardFormSection } from '@/components/Form/CardFormSection'
import { DisabledInput } from '@/components/Form/DisabledInput'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import { SelectItem } from '@/components/Form/SelectInput/SelectItem'
import { TextInput } from '@/components/Form/TextInput'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/axios'

import { NovoLocalModal } from './NovoLocalModal'

const encontroFormSchema = z.object({
  id: z.string().optional(),
  numeroEncontro: z.coerce
    .number({ invalid_type_error: 'Informe o número do encontro' })
    .min(1, 'Deve ser maior que 0'),
  idLocal: z.string().min(1, 'Selecione um local'),
  numeroCirculos: z.coerce
    .number({ invalid_type_error: 'Informe o número de círculos' })
    .min(1, 'Deve ser maior que 0'),
  dataInicio: z.string().min(1, 'Informe a data do encontro'),
  dataTema: z.string().min(1, 'Informe a data da revelação do tema'),
})

export type EncontroFormData = z.infer<typeof encontroFormSchema>

export type LocalOption = {
  id: string
  nomeLocal: string
  numeroLocal: string
  enderecoCep: string
  endereco?: {
    rua: string
    bairro: string
    cidade: string
    estado: string
  }
}

type Props = {
  data?: EncontroFormData
  locais: LocalOption[]
}

export function EncontroForm({ data, locais }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locaisState, setLocaisState] = useState<LocalOption[]>(locais)

  const isNovo = !data || data.numeroCirculos === 0

  const [selectedLocal, setSelectedLocal] = useState<LocalOption | null>(
    data?.idLocal
      ? (locaisState.find((l) => l.id === data.idLocal) ?? null)
      : null,
  )

  const form = useForm<EncontroFormData>({
    resolver: zodResolver(encontroFormSchema),
    defaultValues: {
      id: data?.id ?? '',
      numeroEncontro: data?.numeroEncontro ?? 0,
      idLocal: data?.idLocal ?? '',
      numeroCirculos:
        data?.numeroCirculos && data.numeroCirculos > 0
          ? data.numeroCirculos
          : undefined,
      dataInicio: data?.dataInicio ?? '',
      dataTema: data?.dataTema ?? '',
    },
  })

  const { handleSubmit, control } = form

  function handleLocalCriado(novoLocal: LocalOption) {
    setLocaisState((prev) => [...prev, novoLocal])
    form.setValue('idLocal', novoLocal.id)
    setSelectedLocal(novoLocal)
  }

  async function onSubmit(formData: EncontroFormData) {
    setIsSubmitting(true)
    try {
      await api.put('encontro', {
        id: formData.id,
        numeroEncontro: formData.numeroEncontro,
        dataInicio: formData.dataInicio,
        dataTema: formData.dataTema,
        numeroCirculos: formData.numeroCirculos,
        idLocal: formData.idLocal,
      })

      router.push('/admin/dirigente/gerenciar-encontro')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  const enderecoFormatado = selectedLocal?.endereco
    ? `${selectedLocal.endereco.rua}, ${selectedLocal.nomeLocal} — ${selectedLocal.endereco.bairro}, ${selectedLocal.endereco.cidade} - ${selectedLocal.endereco.estado}`
    : ''

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-tertiary text-2xl font-bold">
              {isNovo ? 'Abrir Novo Encontrão' : 'Editar Encontrão'}
            </h1>
            <span className="text-base font-normal text-zinc-500">
              Preencha as informações abaixo para{' '}
              {isNovo ? 'abrir o novo' : 'editar o'} encontrão. Lembre-se de
              revisar os dados antes de salvar.
            </span>
          </div>

          <input type="hidden" {...form.register('id')} />

          <CardForm title="Dados do Encontro" sectionId="dados-section">
            <CardFormSection>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
                <FormField
                  control={control}
                  name="numeroEncontro"
                  render={({ field }) => (
                    <TextInput label="Número do Encontrão">
                      <Input type="number" disabled {...field} />
                    </TextInput>
                  )}
                />

                <FormField
                  control={control}
                  name="numeroCirculos"
                  render={({ field }) => (
                    <TextInput label="Número de Círculos *">
                      <Input type="number" min={1} {...field} />
                    </TextInput>
                  )}
                />

                <FormField
                  control={control}
                  name="dataInicio"
                  render={({ field }) => (
                    <TextInput label="Data do Encontro *">
                      <Input type="date" {...field} />
                    </TextInput>
                  )}
                />

                <FormField
                  control={control}
                  name="dataTema"
                  render={({ field }) => (
                    <TextInput label="Data da Revelação do Tema *">
                      <Input type="date" {...field} />
                    </TextInput>
                  )}
                />
              </div>
            </CardFormSection>
          </CardForm>

          <CardForm
            title="Local do Encontro"
            sectionId="local-section"
            action={<NovoLocalModal onLocalCriadoAction={handleLocalCriado} />}
          >
            <CardFormSection>
              <div className="flex flex-col gap-4 lg:gap-8">
                <FormField
                  control={control}
                  name="idLocal"
                  render={({ field }) => (
                    <SelectGroupInput
                      label="Selecionar Local *"
                      placeholder="Selecione um local..."
                      value={field.value}
                      onChange={
                        ((val: string) => {
                          field.onChange(val)
                          setSelectedLocal(
                            locaisState.find((l) => l.id === val) ?? null,
                          )
                        }) as unknown as () => void
                      }
                    >
                      {locaisState.map((local) => (
                        <SelectItem
                          key={local.id}
                          value={local.id}
                          text={local.nomeLocal}
                        />
                      ))}
                    </SelectGroupInput>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-8">
                  <DisabledInput
                    label="Nome do Local"
                    value={selectedLocal?.nomeLocal ?? ''}
                  />
                  <DisabledInput
                    label="Número"
                    value={selectedLocal?.numeroLocal ?? ''}
                  />
                  <DisabledInput
                    label="CEP"
                    value={selectedLocal?.enderecoCep ?? ''}
                  />
                  <div className="md:col-span-3">
                    <DisabledInput label="Endereço" value={enderecoFormatado} />
                  </div>
                </div>
              </div>
            </CardFormSection>
          </CardForm>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Salvando...'
                : isNovo
                  ? 'Abrir Encontrão'
                  : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
