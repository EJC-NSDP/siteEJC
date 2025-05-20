import type { CartazQuadrante } from '@/@types/quadrante'
import { ImageUploadField } from '@/components/Form/ImageUploadField'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import type { Value_Quadrante as valueQuadrante } from '@prisma/client'
import { useFormContext } from 'react-hook-form'

interface CartazesProps {
  cartazes: CartazQuadrante[]
}

export function Cartazes({ cartazes }: CartazesProps) {
  const form = useFormContext()

  const { control } = form

  return (
    <Card className="space-y-4 p-4 text-tertiary">
      <CardTitle>Cartazes</CardTitle>
      <CardContent className="grid grid-cols-2 gap-4 p-0">
        {cartazes.map((cartaz, index) => {
          return (
            <div key={cartaz.cor} className="col-span-2 w-full lg:col-span-1">
              <FormField
                control={control}
                name={`cartazes.${index}.imagem`}
                render={({ field }) => (
                  <ImageUploadField
                    name={field.name}
                    publicId={`cartaz_${cartaz.cor.toLowerCase()}`}
                    label={cartaz.cor}
                    folder="/assets/quadrante/cartazes"
                    valueToBeUpdated={
                      cartaz.cor.toLowerCase() as valueQuadrante
                    }
                  />
                )}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
