'use client'

import type { ConfigQuadrante } from '@/@types/quadrante'
import { Capas } from './Capas'
import { Cartas } from './Cartas'
import { Cartazes } from './Cartazes'

interface QuadranteFormProps {
  config: ConfigQuadrante
}

export function QuadranteForm({ config }: QuadranteFormProps) {
  return (
    <div className="space-y-4">
      <Capas
        capaPb={config.capas.principal.pb}
        capaColorida={config.capas.principal.colorida}
        circulosPb={config.capas.circulos.pb}
        circulosColorida={config.capas.circulos.colorida}
        equipes={config.capas.equipes}
      />
      <Cartas
        papa={config.cartas.papa}
        padre={config.cartas.padre}
        diris={config.cartas.diris}
      />
      <Cartazes cartazes={config.cartazes} />
    </div>
  )
}
