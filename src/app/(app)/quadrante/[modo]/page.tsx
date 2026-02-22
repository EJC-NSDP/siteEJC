import { QuadranteCompacto } from './QuadranteCompacto'
import { QuadranteCompleto } from './QuadranteCompleto'

import { fetchQuadranteData } from '@/lib/quadrante/fetchAllData'

export default async function QuadrantePage(props: {
  params: Promise<{ modo: string }>
}) {
  const params = await props.params

  const modoImpimir = params.modo === 'imprimir'
  const data = await fetchQuadranteData(modoImpimir)

  return (
    <>
      {modoImpimir ? (
        <QuadranteCompacto data={data} />
      ) : (
        <QuadranteCompleto data={data} />
      )}
    </>
  )
}
