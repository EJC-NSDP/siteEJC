import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCEPData, type CEPResponse } from '@/utils/fetch-cep'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { useHookFormMask } from 'use-mask-input'
import { CardForm } from '../components/CardForm'

export function AddressCard() {
  const form = useFormContext()
  const { register, control, watch, setValue } = form

  const cepValue = watch('cep')

  useEffect(() => {
    async function fetchAddress(cep: string) {
      const response = await getCEPData(cep)
      if (response === undefined) {
        toast.error('Seu CEP não foi encontrado')
      } else {
        const addressData: CEPResponse = await response.json()
        setValue('estado', addressData.state, {
          shouldValidate: false,
          shouldDirty: true,
        })
        setValue('cidade', addressData.city, { shouldValidate: false })
        setValue('bairro', addressData.neighborhood, { shouldValidate: false })
        setValue('rua', addressData.street, { shouldValidate: false })
      }
    }
    if (cepValue && cepValue[8] !== '_') {
      fetchAddress(cepValue)
    } else {
      setValue('estado', '')
      setValue('cidade', '')
      setValue('bairro', '')
      setValue('rua', '')
    }
  }, [cepValue, setValue])

  const registerWithMask = useHookFormMask(register)

  return (
    <CardForm title="Seu endereço" sectionId="address-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
        <FormField
          control={control}
          name="cep"
          render={({ field }) => (
            <TextInput label={'CEP *'}>
              <Input {...field} {...registerWithMask(field.name, '99999-999')} />
            </TextInput>
          )}
        />

        <FormField
          control={control}
          name="estado"
          render={({ field }) => (
            <TextInput label={'Estado *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />
        <FormField
          control={control}
          name="cidade"
          render={({ field }) => (
            <TextInput label={'Cidade *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />
        <FormField
          control={control}
          name="bairro"
          render={({ field }) => (
            <TextInput label={'Bairro *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />
        <FormField
          control={control}
          name="rua"
          render={({ field }) => (
            <TextInput label={'Rua *'}>
              <Input readOnly={true} {...field} />
            </TextInput>
          )}
        />
        <FormField
          control={control}
          name="numero"
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
