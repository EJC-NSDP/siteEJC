'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuery } from '@tanstack/react-query'
import { GripVertical } from 'lucide-react'
import type { useForm } from 'react-hook-form'

import { SelectGroupInput } from '@/components/Form/SelectInput/SelectGroupInput'
import {
  SelectItem,
  type SelectArray,
} from '@/components/Form/SelectInput/SelectItem'
import { Card, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { getCirculoColor, getCirculoTitleColor } from '@/utils/fetch-color'
import { getTiosCirculoFromEncontro } from '@/utils/fetch-encontros'

import type { CirculoItem, CirculosOrdemData } from './validators'

// ── tipos ──────────────────────────────────────────────────────────────────

export type CirculoCardType = 'CirculoSort'

export interface CirculoDragData {
  type: CirculoCardType
  circulo: CirculoItem
}

// ── card base (usado pelo sortable e pelo overlay) ─────────────────────────

interface CardCirculoBaseProps {
  circulo: CirculoItem
  index?: number
  localIndex?: number
  isAtivo: boolean
  idEncontro: string
  isOverlay?: boolean
  control?: ReturnType<typeof useForm<CirculosOrdemData>>['control']
  dragHandleProps?: Record<string, unknown>
}

export function CardCirculoBase({
  circulo,
  index,
  localIndex,
  isAtivo,
  idEncontro,
  isOverlay,
  control,
  dragHandleProps,
}: CardCirculoBaseProps) {
  const bgColor = getCirculoColor(circulo.cor)
  const titleColor = getCirculoTitleColor(circulo.cor)

  const { data: tiosCirculo } = useQuery<SelectArray[]>({
    queryKey: ['tiosCirculo', idEncontro],
    queryFn: () => getTiosCirculoFromEncontro(idEncontro),
    enabled: !!idEncontro,
  })

  return (
    <Card
      className={cn(
        'w-full overflow-hidden border border-zinc-200 shadow-sm transition-shadow',
        isOverlay && 'cursor-grabbing shadow-xl ring-2 ring-blue-300',
        !isAtivo && 'opacity-60',
      )}
    >
      <div className={cn('h-1.5 w-full', bgColor)} />

      <CardContent className="pt-3 pb-4">
        {/* título + badge de posição + grip */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAtivo && localIndex !== undefined && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                {localIndex + 1}º
              </span>
            )}
            <span className={cn('text-base font-bold', titleColor)}>
              {circulo.cor}
            </span>
          </div>
          <button
            type="button"
            className="cursor-grab touch-none p-1 text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
            {...dragHandleProps}
          >
            <GripVertical className="size-5" />
          </button>
        </div>

        {/* selects de tios */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {control && index !== undefined ? (
            <>
              <FormField
                control={control}
                name={`circulos.${index}.tioAparente`}
                render={({ field }) => (
                  <SelectGroupInput
                    label="Tio Aparente"
                    onChange={field.onChange}
                    value={isAtivo ? (field.value ?? '') : ''}
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
                    value={isAtivo ? (field.value ?? '') : ''}
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
            </>
          ) : (
            // versão readonly para o overlay
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500">Tio Aparente</span>
                <span className="text-sm text-zinc-400">—</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-zinc-500">Tio Secreto</span>
                <span className="text-sm text-zinc-400">—</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── card sortable (usado nas listas) ──────────────────────────────────────

interface CardCirculoProps {
  id: string
  circulo: CirculoItem
  index: number
  localIndex: number
  isAtivo: boolean
  idEncontro: string
  control: ReturnType<typeof useForm<CirculosOrdemData>>['control']
}

export function CardCirculo({
  id,
  circulo,
  index,
  localIndex,
  isAtivo,
  idEncontro,
  control,
}: CardCirculoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'CirculoSort',
      circulo,
    } satisfies CirculoDragData,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-30' : ''}
    >
      <CardCirculoBase
        circulo={circulo}
        index={index}
        localIndex={localIndex}
        isAtivo={isAtivo}
        idEncontro={idEncontro}
        control={control}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
