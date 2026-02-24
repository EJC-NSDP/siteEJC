import type { PalestranteQuadrante } from '@/@types/quadrante'

import { QuadranteOnePage } from './QuadranteOnePage'
import { QuadranteTitlePage } from './QuadranteTitlePage'

interface QuadrantePalestraPageProps {
  title: string
  description: string
  integrantes: PalestranteQuadrante[]
}

export function QuadrantePalestraPage({
  title,
  description,
  integrantes,
}: QuadrantePalestraPageProps) {
  return (
    <QuadranteOnePage>
      <QuadranteTitlePage title={title} description={description}>
        {/* Grid de integrantes */}
        <div className="grid flex-1 grid-cols-2 gap-8">
          {integrantes.map((member, index) => {
            return (
              <div
                key={index}
                className="my-0 flex items-center justify-start px-8 py-0 text-base"
              >
                <div className="flex w-full flex-col text-3xl">
                  <span className="flex w-full flex-col font-bold">
                    {member.nome}
                  </span>
                  <span>Tema: {member.tema}</span>
                </div>
              </div>
            )
          })}
        </div>
      </QuadranteTitlePage>
    </QuadranteOnePage>
  )
}
