import { TextInput } from '@/components/Form/TextInput'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'

export interface CardCapasProps {
  circulos: {
    id: string
    cor: string
    nome: string
    image: string
  }[]
}

export function CardCirculos({ circulos }: CardCapasProps) {
  const { control } = useFormContext()

  return (
    <Card className="space-y-4 p-4">
      <CardTitle className="w-44 p-0 text-lg font-semibold text-tertiary">
        Círculos
      </CardTitle>
      <CardContent className="w-full space-y-4 p-0 text-base font-normal text-zinc-500">
        {circulos.map((circulo) => {
          return (
            <div className="flex items-center gap-4" key={circulo.id}>
              <span className="w-24 font-semibold">{circulo.cor}:</span>{' '}
              <div className="flex items-center gap-4">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <TextInput label={'Nome do círculo'}>
                      <Input {...field} />
                    </TextInput>
                  )}
                />
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <TextInput label={'Imagem'}>
                      <Input {...field} />
                    </TextInput>
                  )}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
