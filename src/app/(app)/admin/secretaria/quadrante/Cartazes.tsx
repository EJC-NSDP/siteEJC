import type { CartazQuadrante } from '@/@types/quadrante'
import { TextInput } from '@/components/Form/TextInput'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

interface CartazesProps {
  cartazes: CartazQuadrante[]
}

export function Cartazes({ cartazes }: CartazesProps) {
  const form = useFormContext()

  const { control } = form

  return (
    <div className="space-y-4">
      {cartazes.map((cartaz, index) => {
        return (
          <FormField
            key={cartaz.cor}
            control={control}
            name={`cartazes.${index}.imagem`}
            render={({ field }) => (
              <TextInput label={`Cartaz ${cartaz.cor}`}>
                <Input autoFocus {...field} />
              </TextInput>
            )}
          />
        )
      })}
    </div>
  )
}
