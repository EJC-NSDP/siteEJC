import { CardQuadrante } from './CardQuadrante'

import type { valueQuadrante } from '@/@types/enums'
import type { CartazQuadrante } from '@/@types/quadrante'
import { ImageUpload } from '@/components/Form/ImageUpload'

interface CartazesProps {
  cartazes: CartazQuadrante[]
}

export function Cartazes({ cartazes }: CartazesProps) {
  return (
    <CardQuadrante
      title="Cartazes"
      className="grid grid-cols-2 gap-4 p-0"
      cartaz
    >
      {cartazes.map((cartaz) => {
        return (
          <div key={cartaz.cor} className="col-span-2 w-full lg:col-span-1">
            <ImageUpload
              label={cartaz.cor}
              publicId={`cartaz_${cartaz.cor.toLowerCase()}`}
              folder="/assets/quadrante/cartazes"
              valueToBeUpdated={cartaz.cor.toLowerCase() as valueQuadrante}
              imageValue={cartaz.imagem}
              type="cartaz"
            />
          </div>
        )
      })}
    </CardQuadrante>
  )
}
