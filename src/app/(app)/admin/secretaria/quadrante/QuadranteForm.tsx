'use client'

import { Capas } from './Capas'
import { Cartas } from './Cartas'
import { Cartazes } from './Cartazes'

import type { ConfigQuadrante } from '@/@types/quadrante'

interface QuadranteFormProps {
  config: ConfigQuadrante
}

export function QuadranteForm({ config }: QuadranteFormProps) {
  return (
    <div className="space-y-4">
      <Capas capas={config.capas} />
      <Cartas cartas={config.cartas} />
      <Cartazes cartazes={config.cartazes} />
    </div>
  )
}
