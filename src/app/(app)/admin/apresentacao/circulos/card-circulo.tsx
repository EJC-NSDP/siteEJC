'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { useForm } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { getCirculoColor, getCirculoTitleColor } from '@/utils/fetch-color'
import { getTiosCirculoFromEncontro } from '@/utils/fetch-encontros'

import type { CirculosOrdemData } from './validators'

interface CardCirculoProps {
  index: number
  totalAtivos: number
  totalFora: number
  isAtivo: boolean
  idEncontro: string
  control: ReturnType<typeof useForm<CirculosOrdemData>>['control']
  onMoveUp: () => void
  onMoveDown: () => void
}

export function CardCirculo({
  index,
  totalAtivos,
  totalFora,
  isAtivo,
  idEncontro,
  control,
  onMoveUp,
  onMoveDown,
}: CardCirculoProps) {
  const cor = useWatch({ control, name: `circulos.${index}.cor` }) ?? ''

  const bgColor = getCirculoColor(cor)
  const titleColor = getCirculoTitleColor(cor)

  const isFirstOverall = index === 0
  // ativo nunca bloqueia ▼ (pode sempre descer para "Fora")
  // inativo bloqueia ▼ só se for o último da lista toda
  const isLastOverall = !isAtivo && index === totalAtivos + totalFora - 1

  const { data: tiosCirculo } = useQuery<SelectArray[]>({
    queryKey: ['tiosCirculo', idEncontro],
    queryFn: () => getTiosCirculoFromEncontro(idEncontro),
    enabled: !!idEncontro,
  })

  return (
    <div className="flex items-center gap-2 lg:gap-4">
      {/* botões de ordenação */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          className="p-0"
          disabled={isFirstOverall}
          onClick={onMoveUp}
          type="button"
          title={
            !isAtivo && index === totalAtivos
              ? 'Mover para Neste Encontro'
              : 'Mover para cima'
          }
        >
          <ChevronUp className="size-5 text-zinc-700 hover:text-zinc-500" />
        </Button>

        <span className="text-xs text-zinc-400">{index + 1}</span>

        <Button
          variant="ghost"
          className="p-0"
          disabled={isLastOverall}
          onClick={onMoveDown}
          type="button"
          title={
            isAtivo && index === totalAtivos - 1
              ? 'Mover para Fora deste Encontro'
              : 'Mover para baixo'
          }
        >
          <ChevronDown className="size-5 text-zinc-700 hover:text-zinc-500" />
        </Button>
      </div>

      {/* card */}
      <Card className="w-full overflow-hidden border border-zinc-200 shadow-sm">
        <div className={cn('h-1.5 w-full', bgColor)} />

        <CardContent className="pt-4 pb-4">
          <span className={cn('mb-4 block text-base font-bold', titleColor)}>
            {cor}
          </span>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <FormField
              control={control}
              name={`circulos.${index}.tioAparente`}
              render={({ field }) => (
                <SelectGroupInput
                  label="Tio Aparente"
                  onChange={field.onChange}
                  value={isAtivo ? field.value : ''}
                  className={!isAtivo ? 'pointer-events-none opacity-40' : ''}
                >
                  <SelectItem value="unknown" text="Não sabemos" />
                  {tiosCirculo?.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      text={item.label}
                    />
                  ))}
                </SelectGroupInput>
              )}
            />

            <FormField
              control={control}
              name={`circulos.${index}.tioSecreto`}
              render={({ field }) => (
                <SelectGroupInput
                  label="Tio Secreto"
                  onChange={field.onChange}
                  value={isAtivo ? field.value : ''}
                  className={!isAtivo ? 'pointer-events-none opacity-40' : ''}
                >
                  <SelectItem value="unknown" text="Não sabemos" />
                  {tiosCirculo?.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      text={item.label}
                    />
                  ))}
                </SelectGroupInput>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
