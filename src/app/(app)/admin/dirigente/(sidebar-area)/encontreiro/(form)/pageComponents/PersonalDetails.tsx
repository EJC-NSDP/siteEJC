'use client'

import { CardForm } from '@/components/Form/CardForm'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'

export function PersonalDetails() {
  const form = useFormContext()

  const { register, control } = form

  const registerWithMask = useHookFormMask(register)

  return (
    <CardForm title="Dados Pessoais" sectionId="personal-section">
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <FormField
          control={control}
          name="pessoa.nome"
          render={({ field }) => (
            <TextInput label={'Nome *'}>
              <Input autoFocus {...field} />
            </TextInput>
          )}
        />

        <FormField
          control={control}
          name="pessoa.sobrenome"
          render={({ field }) => (
            <TextInput label={'Sobrenome *'}>
              <Input {...field} />
            </TextInput>
          )}
        />
        <FormField
          control={control}
          name="pessoa.dataNascimento"
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
          name="pessoa.apelido"
          render={({ field }) => {
            return (
              <TextInput label={'Como gosta de ser chamado?'}>
                <Input {...field} />
              </TextInput>
            )
          }}
        />
        <FormField
          control={control}
          name="pessoa.celular"
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
          name="pessoa.telefone"
          render={({ field }) => {
            return (
              <TextInput label={'Telefone'}>
                <Input
                  {...field}
                  {...registerWithMask(field.name, '(99) 9999-9999')}
                  placeholder="(__) ____-____"
                />
              </TextInput>
            )
          }}
        />

        <FormField
          control={control}
          name="pessoa.email"
          render={({ field }) => {
            return (
              <TextInput label={'Email *'}>
                <Input {...field} placeholder="encontreiro@gmail.com" />
              </TextInput>
            )
          }}
        />

        <FormField
          control={control}
          name="pessoa.instagram"
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
