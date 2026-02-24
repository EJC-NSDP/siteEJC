import type { QuadranteData } from '@/@types/quadrante'
import { PageProvider } from '@/context/PageContext'

import { QuadranteCoverPage } from './(pageComponents)/(pages)/QuadranteCoverPage'
import { QuadranteEquipePage } from './(pageComponents)/(pages)/QuadranteEquipePage'
import { QuadranteOnePage } from './(pageComponents)/(pages)/QuadranteOnePage'
import { QuadrantePalestraPage } from './(pageComponents)/(pages)/QuadrantePalestraPage'
import { QuadranteCirculosSection } from './(pageComponents)/(sections)/QuadranteCirculosSection'
import { QuadranteEquipesSection } from './(pageComponents)/(sections)/QuadranteEquipesSection'
import { QuadrantePastoraisSection } from './(pageComponents)/(sections)/QuadrantePastoraisSection'
import { QuadranteTiosExternaSection } from './(pageComponents)/(sections)/QuadranteTiosExternaSection'

interface QuadranteCompletoProps {
  data: QuadranteData
}

export function QuadranteCompleto({ data }: QuadranteCompletoProps) {
  return (
    <PageProvider>
      {/* Capa */}
      <QuadranteCoverPage
        key="cover"
        imageUrl={data.config.capas.principal.colorida}
        alt="Capa"
      />

      {/* Cartas */}
      <QuadranteCoverPage
        key="papa"
        imageUrl={data.config.cartas.papa}
        alt="Carta Papa"
      />
      <QuadranteCoverPage
        key="padre"
        imageUrl={data.config.cartas.padre}
        alt="Carta Padre"
      />
      <QuadranteCoverPage
        key="dirigentes"
        imageUrl={data.config.cartas.diris}
        alt="Carta Diris"
      />

      {/* Círculos */}
      <QuadranteCirculosSection
        capa={data.config.capas.circulos.colorida}
        cartazes={data.config.cartazes}
        circulos={data.circulos}
        qtdPorPag={10}
      />

      {/* Equipes */}
      {data.equipes && (
        <QuadranteEquipesSection
          capa={data.config.capas.equipes}
          equipes={data.equipes}
          qtdPorPag={10}
        />
      )}

      {/* Tios de Externa */}
      {data.tiosExterna && (
        <QuadranteTiosExternaSection
          tiosExterna={data.tiosExterna}
          qtdPorPag={28}
        />
      )}

      {/* Palestrantes */}
      {data.palestrantes && (
        <QuadrantePalestraPage
          key="Palestrantes"
          title={data.palestrantes.nome}
          description={data.palestrantes.descricao}
          integrantes={data.palestrantes.integrantes}
        />
      )}

      {/* BPs */}
      {data.bonsPastores && (
        <QuadranteOnePage>
          <QuadranteEquipePage
            key="BPs"
            title={data.bonsPastores.nome}
            description={data.bonsPastores.descricao}
            integrantes={data.bonsPastores.integrantes}
          />
        </QuadranteOnePage>
      )}

      {/* Pastorais */}
      {data.pastorais && (
        <QuadrantePastoraisSection pastorais={data.pastorais} maxPorPag={5} />
      )}
    </PageProvider>
  )
}
