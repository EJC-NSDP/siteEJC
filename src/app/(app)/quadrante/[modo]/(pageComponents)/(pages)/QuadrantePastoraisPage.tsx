import Image from 'next/image'

import { QuadranteOnePage } from './QuadranteOnePage'
import { QuadranteTitlePage } from './QuadranteTitlePage'

import type { PastoralQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'

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
                'my-0 flex items-center justify-start gap-4 px-8 py-0 text-base',
                (index + 1) % 2 === 0 && 'flex-row-reverse',
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
