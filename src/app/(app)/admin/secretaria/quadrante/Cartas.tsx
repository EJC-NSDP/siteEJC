import { CardQuadrante } from './CardQuadrante'

import type { CartasQuadrante } from '@/@types/quadrante'
import { ImageUpload } from '@/components/Form/ImageUpload'

interface CartasProps {
  cartas: CartasQuadrante
}

export function Cartas({ cartas }: CartasProps) {
  return (
    <CardQuadrante title="Cartas" className="grid grid-cols-3 gap-4 p-0">
      <div className="col-span-3 w-full lg:col-span-1">
        <ImageUpload
          label="Papa"
          publicId="cartaPapa"
          folder="/assets/quadrante/cartas"
          valueToBeUpdated="carta_papa"
          imageValue={cartas.papa}
          type="capa"
        />
      </div>
      <div className="col-span-3 w-full lg:col-span-1">
        <ImageUpload
          label="Padre"
          publicId="cartaPadre"
          folder="/assets/quadrante/cartas"
          valueToBeUpdated="carta_padre"
          imageValue={cartas.padre}
          type="capa"
        />
      </div>
      <div className="col-span-3 w-full lg:col-span-1">
        <ImageUpload
          label="Dirigentes"
          publicId="cartaDirigentes"
          folder="/assets/quadrante/cartas"
          valueToBeUpdated="carta_diris"
          imageValue={cartas.diris}
          type="capa"
        />
      </div>
    </CardQuadrante>
  )
}
