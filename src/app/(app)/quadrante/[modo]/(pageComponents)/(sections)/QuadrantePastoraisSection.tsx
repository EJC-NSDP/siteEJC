import { QuadrantePastoraisPage } from '../(pages)/QuadrantePastoraisPage'

import type { EquipePastoraisQuadrante } from '@/@types/quadrante'

export interface QuadrantePastoraisSectionProps {
  pastorais: EquipePastoraisQuadrante
  maxPorPag: number
}

export function QuadrantePastoraisSection({
  pastorais,
  maxPorPag,
}: QuadrantePastoraisSectionProps) {
  const totalPastorais = pastorais.pastorais.length
  const qtdPastoraisPorPagina =
    totalPastorais <= maxPorPag ? totalPastorais : Math.ceil(totalPastorais / 2)

  const totalPaginasPastorais = Math.ceil(
    totalPastorais / qtdPastoraisPorPagina,
  )

  const paginas = Array.from({ length: totalPaginasPastorais }, (_, i) => {
    const start = i * qtdPastoraisPorPagina
    const end = start + qtdPastoraisPorPagina
    const pastoraisPag = pastorais.pastorais.slice(start, end)

    return (
      <QuadrantePastoraisPage
        key={`Pastoral-${i}`}
        title={pastorais.nome}
        description={pastorais.descricao}
        pastorais={pastoraisPag}
      />
    )
  })

  return <>{paginas}</>
}
