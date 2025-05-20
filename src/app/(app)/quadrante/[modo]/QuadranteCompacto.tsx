import type { QuadranteData } from '@/@types/quadrante'
import { PageProvider } from '@/context/PageContext'
import { QuadranteCoverPage } from './(pageComponents)/(pages)/QuadranteCoverPage'
import { QuadranteCirculosSection } from './(pageComponents)/(sections)/QuadranteCirculosSection'

interface QuadranteCompactoProps {
  data: QuadranteData
}

export function QuadranteCompacto({ data }: QuadranteCompactoProps) {
  return (
    <PageProvider>
      {/* Capa */}
      <QuadranteCoverPage
        key="cover"
        imageUrl={data.config.capas.principal.pb}
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
        capa={data.config.capas.circulos.pb}
        cartazes={data.config.cartazes}
        circulos={data.circulos}
        qtdPorPag={10}
        pb
      />
    </PageProvider>
  )
}
