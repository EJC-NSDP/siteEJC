import { ImageUploadField } from '@/components/Form/ImageUploadField'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

export function Cartas() {
  const form = useFormContext()

  const { control } = form

  return (
    <Card className="space-y-4 p-4 text-tertiary">
      <CardTitle>Cartas</CardTitle>
      <CardContent className="grid grid-cols-3 gap-4 p-0">
        <div className="col-span-3 w-full lg:col-span-1">
          <FormField
            control={control}
            name="cartaPapa"
            render={({ field }) => (
              <ImageUploadField
                name={field.name}
                publicId="cartaPapa"
                label="Papa"
                folder="/assets/quadrante/cartas"
                valueToBeUpdated="carta_papa"
              />
            )}
          />
        </div>
        <div className="col-span-3 w-full lg:col-span-1">
          <FormField
            control={control}
            name="cartaPadre"
            render={({ field }) => (
              <ImageUploadField
                name={field.name}
                publicId="cartaPadre"
                label="Padre"
                folder="/assets/quadrante/cartas"
                valueToBeUpdated="carta_padre"
              />
            )}
          />
        </div>
        <div className="col-span-3 w-full lg:col-span-1">
          <FormField
            control={control}
            name="cartaDiris"
            render={({ field }) => (
              <ImageUploadField
                name={field.name}
                publicId="cartaDirigentes"
                label="Dirigentes"
                folder="/assets/quadrante/cartas"
                valueToBeUpdated="carta_diris"
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
