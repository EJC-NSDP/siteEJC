import { ImageUpload } from '@/components/Form/ImageUpload'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

interface CartasProps {
  papa: string
  padre: string
  diris: string
}

export function Cartas({ papa, padre, diris }: CartasProps) {
  return (
    <Card className="space-y-4 p-4 text-tertiary">
      <CardTitle>Cartas</CardTitle>
      <CardContent className="grid grid-cols-3 gap-4 p-0">
        <div className="col-span-3 w-full lg:col-span-1">
          <ImageUpload
            label="Papa"
            publicId="cartaPapa"
            folder="/assets/quadrante/cartas"
            valueToBeUpdated="carta_papa"
            imageValue={papa}
            type="capa"
          />
        </div>
        <div className="col-span-3 w-full lg:col-span-1">
          <ImageUpload
            label="Padre"
            publicId="cartaPadre"
            folder="/assets/quadrante/cartas"
            valueToBeUpdated="carta_padre"
            imageValue={padre}
            type="capa"
          />
        </div>
        <div className="col-span-3 w-full lg:col-span-1">
          <ImageUpload
            label="Dirigentes"
            publicId="cartaDirigentes"
            folder="/assets/quadrante/cartas"
            valueToBeUpdated="carta_diris"
            imageValue={diris}
            type="capa"
          />
        </div>
      </CardContent>
    </Card>
  )
}
