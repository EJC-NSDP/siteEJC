import { CardForm } from '@/components/Form/CardForm'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

export function PasswordCard() {
  const form = useFormContext()

  const { control } = form

  return (
    <CardForm title="Sua senha" sectionId="password-section">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FormField
          control={control}
          name="password"
          render={({ field }) => {
            return (
              <TextInput label={'Senha'}>
                <Input {...field} hidable={true} autoFocus />
              </TextInput>
            )
          }}
        />
        <FormField
          control={control}
          name="password_confirmation"
          render={({ field }) => {
            return (
              <TextInput label={'Repita a senha'}>
                <Input {...field} hidable={true} />
              </TextInput>
            )
          }}
        />
      </div>
    </CardForm>
  )
}
