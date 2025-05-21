import type { CapasQuadrante } from '@/@types/quadrante'
import { ImageUpload } from '@/components/Form/ImageUpload'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

interface CapasProps {
  capas: CapasQuadrante
}

export function Capas({ capas }: CapasProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-2 space-y-4 p-4 text-tertiary lg:col-span-1">
        <CardTitle>Capa do Quadrante</CardTitle>
        <CardContent className="grid grid-cols-2 gap-4 p-0">
          <div className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label="Preto e Branco"
              publicId="capaQuadrantePB"
              folder="/assets/quadrante/capas"
              valueToBeUpdated="capa_pb"
              imageValue={capas.principal.pb}
              type="capa"
            />
          </div>
          <div className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label="Colorida"
              publicId="capaQuadranteColorida"
              folder="/assets/quadrante/capas"
              imageValue={capas.principal.colorida}
              type="capa"
              valueToBeUpdated="capa_colorida"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2 space-y-4 p-4 text-tertiary lg:col-span-1">
        <CardTitle>Capa dos Círculos</CardTitle>
        <CardContent className="grid grid-cols-2 gap-4 p-0">
          <div className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label="Preto e Branco"
              publicId="capaCirculosPB"
              folder="/assets/quadrante/capas"
              imageValue={capas.circulos.pb}
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
              imageValue={capas.circulos.colorida}
              type="capa"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 space-y-4 p-4 text-tertiary lg:col-span-1">
        <CardTitle>Capa das Equipes</CardTitle>
        <CardContent className="grid grid-cols-1 gap-4 p-0">
          <div className="col-span-1 w-full">
            <ImageUpload
              publicId="capaEquipes"
              folder="/assets/quadrante/capas"
              valueToBeUpdated="equipe"
              imageValue={capas.equipes}
              type="capa"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 space-y-4 p-4 text-tertiary lg:col-span-1">
        <CardTitle>QR code do Quadrante completo</CardTitle>
        <CardContent className="grid grid-cols-1 gap-4 p-0">
          <div className="col-span-1 w-full">
            <ImageUpload
              publicId="qrCode"
              folder="/assets/quadrante/capas"
              valueToBeUpdated="qrcode"
              imageValue={capas.qrcode}
              type="capa"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
