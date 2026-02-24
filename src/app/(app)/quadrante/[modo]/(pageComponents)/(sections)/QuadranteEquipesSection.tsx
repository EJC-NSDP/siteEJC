import type { EquipeQuadrante } from '@/@types/quadrante'
import {
  idPertenceARosa,
  idPertenceASala,
  idPertenceATropa,
} from '@/utils/pertence'

import { QuadranteCoverPage } from '../(pages)/QuadranteCoverPage'
import { QuadranteEquipePage } from '../(pages)/QuadranteEquipePage'
import { QuadranteOnePage } from '../(pages)/QuadranteOnePage'
import { QuadranteTwoPage } from '../(pages)/QuadranteTwoPage'

export interface QuadranteEquipesSectionProps {
  equipes: EquipeQuadrante[]
  qtdPorPag: number
  capa: string
}

export function QuadranteEquipesSection({
  capa,
  equipes,
  qtdPorPag,
}: QuadranteEquipesSectionProps) {
  const equipesTropa = equipes.filter((equipe) =>
    idPertenceATropa(equipe.value),
  )
  const equipesSala = equipes.filter((equipe) => idPertenceASala(equipe.value))
  const equipesRosa = equipes.filter((equipe) => idPertenceARosa(equipe.value))
  const dirigentes = equipes.filter((equipe) => equipe.value === 'dirigente')

  return (
    <>
      <QuadranteCoverPage
        key="capa-equipes"
        imageUrl={capa}
        alt="Capa Equipes"
      />

      {/* Equipes com tropa */}
      {equipesTropa.flatMap((equipe) => {
        const membros = equipe.integrantes
        const total = membros.length

        const totalPaginas = Math.ceil(total / qtdPorPag)

        const paginas = Array.from({ length: totalPaginas }, (_, i) => {
          const start = i * qtdPorPag
          const end = start + qtdPorPag
          const integrantesPag = membros.slice(start, end)

          return (
            <QuadranteOnePage key={`${equipe.nome}-${i}`}>
              <QuadranteEquipePage
                title={equipe.nome}
                description={equipe.descricao}
                integrantes={integrantesPag}
              />
            </QuadranteOnePage>
          )
        })

        return paginas
      })}

      {/* Sala */}
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Apresentação"
          title={`${equipesSala[0].nome} (Sala)`}
          description={equipesSala[0].descricao}
          integrantes={equipesSala[0].integrantes}
        />
        <QuadranteEquipePage
          key="BVs"
          title={`${equipesSala[1].nome} (Sala)`}
          description={equipesSala[1].descricao}
          integrantes={equipesSala[1].integrantes}
        />
      </QuadranteTwoPage>
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Tio Aparente"
          title={`${equipesSala[2].nome} (Sala)`}
          description={equipesSala[2].descricao}
          integrantes={equipesSala[2].integrantes}
        />
        <QuadranteEquipePage
          key="Tio Secreto"
          title={`${equipesSala[3].nome} (Sala)`}
          description={equipesSala[3].descricao}
          integrantes={equipesSala[3].integrantes}
        />
      </QuadranteTwoPage>

      {/* Rosa */}
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Compras"
          title={`${equipesRosa[0].nome} (Rosa)`}
          description={equipesRosa[0].descricao}
          integrantes={equipesRosa[0].integrantes}
        />
        <QuadranteEquipePage
          key="Externa"
          title={`${equipesRosa[1].nome} (Rosa)`}
          description={equipesRosa[1].descricao}
          integrantes={equipesRosa[1].integrantes}
        />
      </QuadranteTwoPage>
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Meditação"
          title={`${equipesRosa[2].nome} (Rosa)`}
          description={equipesRosa[2].descricao}
          integrantes={equipesRosa[2].integrantes}
        />
        <QuadranteEquipePage
          key="Recepção"
          title={`${equipesRosa[3].nome} (Rosa)`}
          description={equipesRosa[3].descricao}
          integrantes={equipesRosa[3].integrantes}
        />
      </QuadranteTwoPage>
      <QuadranteOnePage>
        <QuadranteEquipePage
          key="Vigília"
          title={`${equipesRosa[4].nome} (Rosa)`}
          description={equipesRosa[4].descricao}
          integrantes={equipesRosa[4].integrantes}
        />
      </QuadranteOnePage>

      {/* Dirigentes */}
      <QuadranteOnePage>
        <QuadranteEquipePage
          key="Dirigentes"
          title={dirigentes[0].nome}
          description={dirigentes[0].descricao}
          integrantes={dirigentes[0].integrantes}
        />
      </QuadranteOnePage>
    </>
  )
}
