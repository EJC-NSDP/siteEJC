'use client'

import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { useHookFormMask } from 'use-mask-input'

import { CardForm } from '@/components/Form/CardForm'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCEPData, type CEPResponse } from '@/utils/fetch-cep'

export function AddressDetails() {
  const form = useFormContext()

  const { register, watch, setValue, control } = form

  const cepValue = watch('endereco.enderecoCep')

  useEffect(() => {
    async function fetchAddress(cep: string) {
      const response = await getCEPData(cep)
      if (response === undefined) {
        toast.error('Seu CEP não foi encontrado')
      } else {
        const addressData: CEPResponse = await response.json()
        setValue('endereco.estado', addressData.state, {
          shouldValidate: false,
          shouldDirty: true,
        })
        setValue('endereco.cidade', addressData.city, { shouldValidate: false })
        setValue('endereco.bairro', addressData.neighborhood, {
          shouldValidate: false,
        })
        setValue('endereco.rua', addressData.street, { shouldValidate: false })
      }
    }
    if (cepValue && cepValue[8] !== '_') {
      fetchAddress(cepValue)
    } else {
      setValue('endereco.estado', '')
      setValue('endereco.cidade', '')
      setValue('endereco.bairro', '')
      setValue('endereco.rua', '')
    }
  }, [cepValue, setValue])

  const registerWithMask = useHookFormMask(register)

  return (
    <CardForm title="Endereço" sectionId="address-section">
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <FormField
          control={control}
          name="endereco.enderecoCep"
          render={({ field }) => (
            <TextInput label={'CEP *'}>
              <Input
                autoFocus
                {...field}
                {...registerWithMask(field.name, '99999-999')}
              />
            </TextInput>
          )}
        />

        <FormField
          control={control}
          name="endereco.estado"
          render={({ field }) => (
            <TextInput label={'Estado *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />
        <FormField
          control={control}
          name="endereco.cidade"
          render={({ field }) => (
            <TextInput label={'Cidade *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />

        <FormField
          control={control}
          name="endereco.bairro"
          render={({ field }) => (
            <TextInput label={'Bairro *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />

        <FormField
          control={control}
          name="endereco.rua"
          render={({ field }) => (
            <TextInput label={'Rua *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />

        <FormField
          control={control}
          name="endereco.enderecoNumero"
          render={({ field }) => (
            <TextInput label={'Número *'}>
              <Input {...field} />
            </TextInput>
          )}
        />
      </div>
    </CardForm>
  )
}
