import { QuadranteTiosExternaPage } from '../(pages)/QuadranteTiosExternaPage'

import type { EquipeTiosExternaQuadrante } from '@/@types/quadrante'

export interface QuadranteTiosExternaSectionProps {
  tiosExterna: EquipeTiosExternaQuadrante
  qtdPorPag: number
}

export function QuadranteTiosExternaSection({
  tiosExterna,
  qtdPorPag,
}: QuadranteTiosExternaSectionProps) {
  const totalTios = tiosExterna.integrantes.length
  const totalPaginasTios = Math.ceil(totalTios / qtdPorPag)

  const paginas = Array.from({ length: totalPaginasTios }, (_, i) => {
    const start = i * qtdPorPag
    const end = start + qtdPorPag
    const integrantesPag = tiosExterna.integrantes.slice(start, end)

    return (
      <QuadranteTiosExternaPage
        key={`tios-externa-${i}`}
        title={tiosExterna.nome}
        description={tiosExterna.descricao}
        integrantes={integrantesPag}
      />
    )
  })

  return <>{paginas}</>
}
