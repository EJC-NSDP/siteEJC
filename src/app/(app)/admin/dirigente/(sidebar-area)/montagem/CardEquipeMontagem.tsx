import { useQuery } from '@tanstack/react-query'
import { Crown } from 'lucide-react'

import type { EquipeMontagemAggregated } from '@/app/api/domains/equipes/montagem/aggregated/[value]/get-equipe'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'
import {
  getEquipeBorderColor,
  getEquipeColor,
  getTextEquipeColor,
} from '@/utils/fetch-color'

export interface CardEquipeMontagemProps {
  value: string
}

async function getEquipe(value: string) {
  const response: EquipeMontagemAggregated = await api
    .get(`domains/equipes/montagem/aggregated/${value}`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function CardEquipeMontagem({ value }: CardEquipeMontagemProps) {
  const { data: equipe } = useQuery<EquipeMontagemAggregated>({
    queryKey: ['equipes', value],
    queryFn: () => getEquipe(value),
  })

  return (
    <>
      {equipe ? (
        value !== 'sem_equipe' ? (
          <Accordion type="single" collapsible>
            <AccordionItem
              value={value}
              className={cn(
                'rounded-xl border-none px-4',
                value === 'ordem' ||
                  value === 'sala' ||
                  value === 'rosa' ||
                  value === 'teatro'
                  ? 'text-white'
                  : 'text-zinc-700',
                getEquipeColor(value),
              )}
            >
              <AccordionTrigger>
                <div className="flex w-full items-center justify-between pr-2">
                  <div className="flex items-center gap-2">
                    {value !== 'sem_equipe' && (
                      <div
                        className={cn(
                          'rounded-full border bg-white p-1',
                          getEquipeBorderColor(value),
                          equipe.coordDone
                            ? 'bg-primary opacity-100'
                            : 'bg-white opacity-30',
                        )}
                      >
                        <Crown
                          className={cn(
                            'size-4 border-none',
                            getTextEquipeColor(value),
                            equipe.coordDone
                              ? 'text-white opacity-100'
                              : 'opacity-60',
                          )}
                        />
                        {equipe.coordDone}
                      </div>
                    )}
                    <span
                      className={cn(
                        value === 'ordem' ||
                          value === 'sala' ||
                          value === 'rosa' ||
                          value === 'teatro'
                          ? 'text-white'
                          : 'text-zinc-700',
                      )}
                    >
                      {equipe.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-sm',
                      value === 'ordem' ||
                        value === 'sala' ||
                        value === 'rosa' ||
                        value === 'teatro'
                        ? 'text-white'
                        : 'text-zinc-700',
                    )}
                  >
                    {equipe.total}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-4">
                {equipe.content.map((contentString, index) => {
                  return (
                    <span
                      key={index}
                      className={cn(
                        value === 'ordem' ||
                          value === 'sala' ||
                          value === 'rosa' ||
                          value === 'teatro'
                          ? 'text-white'
                          : 'text-zinc-700',
                      )}
                    >
                      {contentString}
                    </span>
                  )
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Card
            className={cn(
              'flex flex-1 items-center justify-between rounded-xl border-none px-4 py-4 font-medium text-zinc-700 transition-all',
              getEquipeColor(value),
            )}
          >
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-700">{equipe.label}</span>
              </div>
              <span className="text-zinc-700">{equipe.total}</span>
            </div>
          </Card>
        )
      ) : (
        <Skeleton className="flex flex-1 rounded-xl px-4 py-7" />
      )}
    </>
  )
}
