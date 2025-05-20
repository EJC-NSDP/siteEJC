import { ImageUploadField } from '@/components/Form/ImageUploadField'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

export function Capas() {
  const form = useFormContext()

  const { control } = form

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-4 text-tertiary">
        <CardTitle>Capa do Quadrante</CardTitle>
        <CardContent className="grid grid-cols-2 gap-4 p-0">
          <div className="col-span-2 w-full lg:col-span-1">
            <FormField
              control={control}
              name="capaPb"
              render={({ field }) => (
                <ImageUploadField
                  name={field.name}
                  label="Preto e Branco"
                  publicId="capaQuadrantePB"
                  folder="/assets/quadrante/capas"
                  valueToBeUpdated="capa_pb"
                />
              )}
            />
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <FormField
              control={control}
              name="capaColorida"
              render={({ field }) => (
                <ImageUploadField
                  name={field.name}
                  label="Colorida"
                  publicId="capaQuadranteColorida"
                  folder="/assets/quadrante/capas"
                  valueToBeUpdated="capa_colorida"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="space-y-4 p-4 text-tertiary">
        <CardTitle>Capa dos Círculos</CardTitle>
        <CardContent className="grid grid-cols-2 gap-4 p-0">
          <div className="col-span-2 w-full lg:col-span-1">
            <FormField
              control={control}
              name="circulosPb"
              render={({ field }) => (
                <ImageUploadField
                  name={field.name}
                  label="Preto e Branco"
                  publicId="capaCirculosPB"
                  folder="/assets/quadrante/capas"
                  valueToBeUpdated="circulos_pb"
                />
              )}
            />
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <FormField
              control={control}
              name="circulosColorida"
              render={({ field }) => (
                <ImageUploadField
                  name={field.name}
                  label="Colorida"
                  publicId="capaCirculosColorida"
                  folder="/assets/quadrante/capas"
                  valueToBeUpdated="circulos_colorida"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="space-y-2 p-4 text-tertiary">
        <CardTitle>Capa das Equipes</CardTitle>
        <CardContent className="grid grid-cols-1 gap-4 p-0">
          <div className="col-span-1 w-full">
            <FormField
              control={control}
              name="equipe"
              render={({ field }) => (
                <ImageUploadField
                  name={field.name}
                  publicId="capaEquipes"
                  folder="/assets/quadrante/capas"
                  valueToBeUpdated="equipe"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
