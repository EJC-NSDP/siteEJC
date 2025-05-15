import type { PastoralQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'
import { Anton } from 'next/font/google'
import Image from 'next/image'
import { QuadranteOnePage } from './QuadranteOnePage'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
})

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

      <div className="mt-0 flex flex-col items-center gap-16">
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
                height={200}
                width={200}
                alt={pastoral.nome}
              />
              <div className="flex w-full flex-col">
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
      </div>
    </QuadranteOnePage>
  )
}
