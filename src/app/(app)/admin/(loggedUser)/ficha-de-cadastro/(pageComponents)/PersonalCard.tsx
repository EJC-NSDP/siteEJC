import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'

import tamanhoCamisaReference from '@/assets/TamanhoCamisaReference.jpeg'
import { CardForm } from '@/components/Form/CardForm'
import { DisabledInput } from '@/components/Form/DisabledInput'
import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getTamanhoCamisa } from '@/utils/fetch-domains'

export function PersonalCard() {
  const { data: tamanhoCamisa } = useQuery<SelectArray[]>({
    queryFn: async () => await getTamanhoCamisa(),
    queryKey: ['tamanhoCamisa'],
  })

  const form = useFormContext()

  const { register, watch, control } = form

  const nomeValue = watch('nome')
  const sobrenomeValue = watch('sobrenome')
  const dataNascValue = watch('dataNascimento')
  const emailValue = watch('email')

  const registerWithMask = useHookFormMask(register)

  return (
    <CardForm title="Sobre você" sectionId="personal-section">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DisabledInput label="Nome" value={nomeValue} />
        <DisabledInput label="Sobrenome" value={sobrenomeValue} />
        <DisabledInput label="Email" value={emailValue} />
        <DisabledInput label="Nascimento" value={dataNascValue} />
        <FormField
          control={control}
          name="apelido"
          render={({ field }) => {
            return (
              <TextInput label={'Como gostaria de ser chamado?'}>
                <Input {...field} />
              </TextInput>
            )
          }}
        />
        <FormField
          control={control}
          name="celular"
          render={({ field }) => {
            return (
              <TextInput label={'Celular *'}>
                <Input
                  {...field}
                  {...registerWithMask(field.name, '(99) [9]9999-9999')}
                  placeholder="(__) _____-____"
                />
              </TextInput>
            )
          }}
        />
        <FormField
          control={control}
          name="instagram"
          render={({ field }) => {
            return (
              <TextInput
                label={'Instagram'}
                description="Aproveita pra seguir a @pdcejc! Já ativou o sininho pra receber as noticias e fofocas do EJC em primeira mão?"
              >
                <Input {...field} prefix="@" />
              </TextInput>
            )
          }}
        />
        <FormField
          control={control}
          name="tamanhoCamisa"
          render={({ field }) => {
            return (
              <SelectGroupInput
                label="Qual é seu tamanho de camisa?"
                placeholder="Selecione uma opção"
                onChange={field.onChange}
                value={field.value}
                tip={
                  <Image
                    src={tamanhoCamisaReference}
                    alt="Tamanhos de camisa"
                  />
                }
              >
                {tamanhoCamisa &&
                  tamanhoCamisa.map((item) => {
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
          name="restricaoAlimentar"
          render={({ field }) => (
            <TextInput label={'Restrições alimentares'}>
              <Textarea {...field} />
            </TextInput>
          )}
        />
      </div>
    </CardForm>
  )
}
