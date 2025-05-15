import type { TioExternaQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'
import { Anton } from 'next/font/google'
import { QuadranteOnePage } from './QuadranteOnePage'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
})

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
      <div className="flex w-full flex-col items-center gap-2 pb-8 text-center">
        <h1
          className={cn('text-7xl font-bold tracking-wider', anton.className)}
        >
          {title.toUpperCase()}
        </h1>
        <h2 className="w-4/5 text-pretty text-lg italic text-zinc-800">
          {description}
        </h2>
      </div>

      <div className="mt-0 flex flex-col gap-8">
        {/* Grid de integrantes */}
        <div className="grid flex-1 grid-cols-2 gap-4">
          {integrantes.map((member, index) => {
            return (
              <div
                key={index}
                className="my-0 flex items-center justify-start px-8 py-0 text-base"
              >
                <div className="flex w-full flex-col">
                  <span className="flex w-full flex-col font-bold">
                    {member.nome}
                  </span>
                  <span>Bairro: {member.bairro}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </QuadranteOnePage>
  )
}
