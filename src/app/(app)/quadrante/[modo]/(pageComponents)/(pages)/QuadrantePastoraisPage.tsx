import Image from 'next/image'

import type { PastoralQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'

import { QuadranteOnePage } from './QuadranteOnePage'
import { QuadranteTitlePage } from './QuadranteTitlePage'

interface QuadrantePastoraisPageProps {
  title: string
  description: string
  pastorais: PastoralQuadrante[]
}

export function QuadrantePastoraisPage({
  title,
  description,
  pastorais,
}: QuadrantePastoraisPageProps) {
  return (
    <QuadranteOnePage>
      <QuadranteTitlePage
        title={title}
        description={description}
        className="items-center space-y-20"
      >
        {pastorais.map((pastoral, index) => {
          return (
            <div
              key={index}
              className={cn(
                'mb-4 flex items-center justify-center gap-4 rounded-lg border border-zinc-200 py-4 text-base',
                (index + 1) % 2 === 0 && 'flex-row-reverse pr-48',
                (index + 1) % 2 === 1 && 'flex-row pl-32',
              )}
            >
              <Image
                src={pastoral.logo}
                height={400}
                width={400}
                alt={pastoral.nome}
              />
              <div className="flex w-full flex-col text-3xl">
                {pastoral.integrantes.map((integrante) => {
                  return (
                    <span
                      key={integrante}
                      className={cn(
                        'flex w-full flex-col text-left',
                        (index + 1) % 2 === 0 && 'text-right',
                      )}
                    >
                      {integrante}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </QuadranteTitlePage>
    </QuadranteOnePage>
  )
}
