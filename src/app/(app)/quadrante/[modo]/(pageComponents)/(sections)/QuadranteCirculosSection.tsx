import type { CartazQuadrante, CirculoQuadrante } from '@/@types/quadrante'
import { QuadranteCirculoPage } from '../(pages)/QuadranteCirculoPage'
import { QuadranteCoverPage } from '../(pages)/QuadranteCoverPage'

export interface QuadranteCirculosSectionProps {
  circulos: CirculoQuadrante[]
  qtdPorPag: number
  capa: string
  cartazes: CartazQuadrante[]
  pb?: boolean
}

export function QuadranteCirculosSection({
  capa,
  cartazes,
  circulos,
  qtdPorPag,
  pb = false,
}: QuadranteCirculosSectionProps) {
  return (
    <>
      <QuadranteCoverPage
        key="capa-circulos"
        imageUrl={capa}
        alt="Capa Circulos"
      />

      {circulos.flatMap((circulo) => {
        const cartazUrl = cartazes.find((cartaz) => cartaz.cor === circulo.cor)
        const membros = circulo.integrantes
        const total = membros.length
        const tamanhoCartaz = 4
        const totalPaginas = Math.ceil(total / qtdPorPag)

        const paginas = Array.from({ length: totalPaginas }, (_, i) => {
          const start = i * qtdPorPag
          const end = start + qtdPorPag
          const integrantesPag = membros.slice(start, end)

          const isUltima = i === totalPaginas - 1
          const espacosRestantes = qtdPorPag - integrantesPag.length
          const incluiCartaz = isUltima && espacosRestantes >= tamanhoCartaz

          return (
            <QuadranteCirculoPage
              key={`${circulo.cor}-${i}`}
              title={`Círculo ${circulo.cor}`}
              circleColor={circulo.cor}
              integrantes={integrantesPag}
              cartazUrl={incluiCartaz ? cartazUrl?.imagem : undefined}
              isPb={pb}
            />
          )
        })

        // Se não coube o cartaz na última página, adiciona uma extra
        const sobraEspacos =
          total % qtdPorPag === 0 ? 0 : qtdPorPag - (total % qtdPorPag)
        const precisaDePaginaExtra = sobraEspacos < tamanhoCartaz

        if (precisaDePaginaExtra) {
          paginas.push(
            <QuadranteCirculoPage
              key={`${circulo.cor}-cartaz`}
              title={`Círculo ${circulo.cor}`}
              circleColor={circulo.cor}
              integrantes={[]}
              cartazUrl={cartazUrl?.imagem}
              isPb={pb}
            />,
          )
        }

        return paginas
      })}
    </>
  )
}
