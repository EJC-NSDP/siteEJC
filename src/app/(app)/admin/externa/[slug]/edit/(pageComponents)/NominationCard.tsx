import { CardForm } from '@/components/Form/CardForm'
import { CardFormSection } from '@/components/Form/CardFormSection'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'

export function NominationCard() {
  const form = useFormContext()

  const { register, control } = form

  const registerWithMask = useHookFormMask(register)

  return (
    <CardForm title="Indicação" sectionId="nomination-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <CardFormSection>
          <FormField
            control={control}
            name="indicadoPorNome"
            render={({ field }) => (
              <TextInput label={'Nome de quem te convidou'}>
                <Input {...field} />
              </TextInput>
            )}
          />

          <FormField
            control={control}
            name="indicadoApelido"
            render={({ field }) => (
              <TextInput label={'Apelido de quem te convidou'}>
                <Input {...field} />
              </TextInput>
            )}
          />
        </CardFormSection>
        <CardFormSection>
          <FormField
            control={control}
            name="indicadoTelefone"
            render={({ field }) => (
              <TextInput label={'Telefone de quem te convidou'}>
                <Input
                  {...field}
                  {...registerWithMask(field.name, '(99) [9]9999-9999')}
                  placeholder="(__) _____-____"
                />
              </TextInput>
            )}
          />
          <FormField
            control={control}
            name="indicadoEmail"
            render={({ field }) => (
              <TextInput label={'Email de quem te convidou'}>
                <Input type="email" {...field} />
              </TextInput>
            )}
          />
        </CardFormSection>
      </div>
    </CardForm>
  )
}
