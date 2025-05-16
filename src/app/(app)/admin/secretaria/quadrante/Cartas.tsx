import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

export function Cartas() {
  const form = useFormContext()

  const { control } = form

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="cartaPapa"
        render={({ field }) => (
          <TextInput label={'Carta do Papa'}>
            <Input autoFocus {...field} />
          </TextInput>
        )}
      />
      <FormField
        control={control}
        name="cartaPadre"
        render={({ field }) => (
          <TextInput label={'Carta do Padre'}>
            <Input autoFocus {...field} />
          </TextInput>
        )}
      />
      <FormField
        control={control}
        name="cartaDiris"
        render={({ field }) => (
          <TextInput label={'Carta dos Diris'}>
            <Input autoFocus {...field} />
          </TextInput>
        )}
      />
    </div>
  )
}
