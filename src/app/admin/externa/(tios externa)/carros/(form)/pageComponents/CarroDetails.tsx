'use client'

import { CardForm } from '@/components/Form/CardForm'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getNextCarroEncontro } from '@/utils/fetch-this-encontro'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

interface CarroDetailsProps {
  disabled?: boolean
}

export function CarroDetails({ disabled = false }: CarroDetailsProps) {
  const form = useFormContext()

  const { control, setValue, watch } = form

  const nextCarroValue = watch('carro.numeroCarro')

  useEffect(() => {
    async function fetchNextCarro() {
      const response = await getNextCarroEncontro()
      if (response !== undefined) {
        setValue('carro.numeroCarro', response, {
          shouldValidate: false,
        })
      }
    }
    if (!nextCarroValue) fetchNextCarro()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <CardForm title="Carro" sectionId="car-section">
      <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2 lg:gap-8">
        <FormField
          control={control}
          name="carro.numeroCarro"
          render={({ field }) => (
            <TextInput label={'Número do carro nesse encontro *'}>
              <Input readOnly={disabled} autoFocus {...field} />
            </TextInput>
          )}
        />
        <FormField
          control={control}
          name="carro.placaCarro"
          render={({ field }) => {
            return (
              <TextInput label={'Placa *'}>
                <Input readOnly={disabled} {...field} />
              </TextInput>
            )
          }}
        />
        <FormField
          control={control}
          name="carro.modeloCarro"
          render={({ field }) => (
            <TextInput label={'Modelo *'}>
              <Input readOnly={disabled} {...field} />
            </TextInput>
          )}
        />

        <FormField
          control={control}
          name="carro.lugaresCarro"
          render={({ field }) => {
            return (
              <TextInput label={'Vagas no carro *'}>
                <Input readOnly={disabled} {...field} />
              </TextInput>
            )
          }}
        />
        <FormField
          control={control}
          name="motorista.observacaoMotorista"
          render={({ field }) => {
            return (
              <TextInput label={'Observações do Motorista'}>
                <Textarea readOnly={disabled} {...field} />
              </TextInput>
            )
          }}
        />

        <FormField
          control={control}
          name="carro.observacaoExterna"
          render={({ field }) => {
            return (
              <TextInput label={'Observações da Externa'}>
                <Textarea readOnly={disabled} {...field} />
              </TextInput>
            )
          }}
        />
      </div>
    </CardForm>
  )
}
