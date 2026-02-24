import type { TioExternaQuadrante } from '@/@types/quadrante'

import { QuadranteOnePage } from './QuadranteOnePage'
import { QuadranteTitlePage } from './QuadranteTitlePage'

interface QuadranteTiosExternaPageProps {
  title: string
  description: string
  integrantes: TioExternaQuadrante[]
}

export function QuadranteTiosExternaPage({
  title,
  description,
  integrantes,
}: QuadranteTiosExternaPageProps) {
  return (
    <QuadranteOnePage>
      <QuadranteTitlePage title={title} description={description}>
        {/* Grid de integrantes */}
        <div className="grid flex-1 grid-cols-2 gap-4">
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
                  <span>Bairro: {member.bairro}</span>
                </div>
              </div>
            )
          })}
        </div>
      </QuadranteTitlePage>
    </QuadranteOnePage>
  )
}
