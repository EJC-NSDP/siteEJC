import { CardForm } from '@/components/Form/CardForm'
import { DisabledInput } from '@/components/Form/DisabledInput'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'

export function PersonalCard() {
  const form = useFormContext()

  const { register, control, watch } = form

  const registerWithMask = useHookFormMask(register)

  const nomeValue = watch('nome')

  return (
    <CardForm title="Dados Pessoais" sectionId="personal-section">
      <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-2 lg:gap-8">
        <DisabledInput label="Nome" value={nomeValue} />
        {/* <FormField
          control={control}
          name="nome"
          render={({ field }) => (
            <TextInput label={'Nome *'}>
              <Input autoFocus {...field} />
            </TextInput>
          )}
        /> */}
        <FormField
          control={control}
          name="sobrenome"
          render={({ field }) => (
            <TextInput label={'Sobrenome *'}>
              <Input autoFocus {...field} />
            </TextInput>
          )}
        />
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
          name="dataNascimento"
          render={({ field }) => {
            return (
              <TextInput label={'Nascimento *'}>
                <Input
                  {...field}
                  {...registerWithMask(field.name, '99/99/9999')}
                  placeholder="DD/MM/AAAA"
                />
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
              <TextInput label={'Instagram'}>
                <Input {...field} prefix="instagram.com/" />
              </TextInput>
            )
          }}
        />
      </div>
    </CardForm>
  )
}
