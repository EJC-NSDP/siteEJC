import { ImageUpload } from '@/components/Form/ImageUpload'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

interface CapasProps {
  capaPb: string
  capaColorida: string
  circulosPb: string
  circulosColorida: string
  equipes: string
}

export function Capas({
  capaPb,
  capaColorida,
  circulosPb,
  circulosColorida,
  equipes,
}: CapasProps) {
  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-4 text-tertiary">
        <CardTitle>Capa do Quadrante</CardTitle>
        <CardContent className="grid grid-cols-2 gap-4 p-0">
          <div className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label="Preto e Branco"
              publicId="capaQuadrantePB"
              folder="/assets/quadrante/capas"
              valueToBeUpdated="capa_pb"
              imageValue={capaPb}
              type="capa"
            />
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label="Colorida"
              publicId="capaQuadranteColorida"
              folder="/assets/quadrante/capas"
              imageValue={capaColorida}
              type="capa"
              valueToBeUpdated="capa_colorida"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="space-y-4 p-4 text-tertiary">
        <CardTitle>Capa dos Círculos</CardTitle>
        <CardContent className="grid grid-cols-2 gap-4 p-0">
          <div className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label="Preto e Branco"
              publicId="capaCirculosPB"
              folder="/assets/quadrante/capas"
              imageValue={circulosPb}
              type="capa"
              valueToBeUpdated="circulos_pb"
            />
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label="Colorida"
              publicId="capaCirculosColorida"
              folder="/assets/quadrante/capas"
              valueToBeUpdated="circulos_colorida"
              imageValue={circulosColorida}
              type="capa"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="space-y-2 p-4 text-tertiary">
        <CardTitle>Capa das Equipes</CardTitle>
        <CardContent className="grid grid-cols-1 gap-4 p-0">
          <div className="col-span-1 w-full">
            <ImageUpload
              publicId="capaEquipes"
              folder="/assets/quadrante/capas"
              valueToBeUpdated="equipe"
              imageValue={equipes}
              type="capa"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
