import { fetchQuadranteData } from '@/lib/quadrante/fetchAllData'
import { QuadranteCompacto } from './QuadranteCompacto'
import { QuadranteCompleto } from './QuadranteCompleto'

interface Props {
  params: { modo: 'imprimir' | 'completo' }
}

export default async function QuadrantePage({ params }: Props) {
  const pb = params.modo === 'imprimir'
  const data = await fetchQuadranteData(params.modo)

  return (
    <div className="h-full w-full">
      {pb ? (
        <QuadranteCompacto data={data} />
      ) : (
        <QuadranteCompleto data={data} />
      )}
    </div>
  )
}
