'use client'

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { CirculosResponse } from '@/app/api/encontro/atual/[ignorar]/circulos/get-circulos'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/axios'

import { CardCirculo, CardCirculoBase } from './card-circulo'
import {
  circulosOrdemScheme,
  type CirculoItem,
  type CirculosOrdemData,
} from './validators'

const DROPPABLE_ATIVOS = 'zona-ativos'
const DROPPABLE_INATIVOS = 'zona-inativos'

const COR_POR_ID: Record<number, string> = {
  1: 'Amarelo',
  2: 'Azul',
  3: 'Laranja',
  4: 'Verde',
  5: 'Vermelho',
}

function buildLists(response: CirculosResponse): {
  ativos: CirculoItem[]
  inativos: CirculoItem[]
  order: number
} {
  const orderDigits = response.order.toString().split('').map(Number)
  const circuloById = Object.fromEntries(
    response.circulos.map((c) => [c.idCorCirculo, c]),
  )

  const ativos: CirculoItem[] = orderDigits
    .filter((digit) => circuloById[digit])
    .map((digit) => ({
      id: circuloById[digit].id,
      idCorCirculo: circuloById[digit].idCorCirculo,
      cor: COR_POR_ID[digit] ?? '',
      tioAparente: '',
      tioSecreto: '',
      ativo: true,
    }))

  const idsAtivos = new Set(orderDigits)

  const inativos: CirculoItem[] = response.circulos
    .filter((c) => !idsAtivos.has(c.idCorCirculo))
    .map((c) => ({
      id: c.id,
      idCorCirculo: c.idCorCirculo,
      cor: COR_POR_ID[c.idCorCirculo] ?? '',
      tioAparente: '',
      tioSecreto: '',
      ativo: false,
    }))

  return { ativos, inativos, order: response.order }
}

function computeOrder(ativos: CirculoItem[]): number {
  return Number(ativos.map((c) => c.idCorCirculo).join(''))
}

function DroppableZone({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className="min-h-16">
      {children}
    </div>
  )
}

interface SortCirculosProps {
  circulosEncontro: CirculosResponse
  idEncontro: string
}

export function SortCirculos({
  circulosEncontro,
  idEncontro,
}: SortCirculosProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const initial = buildLists(circulosEncontro)
  const [ativos, setAtivos] = useState<CirculoItem[]>(initial.ativos)
  const [inativos, setInativos] = useState<CirculoItem[]>(initial.inativos)
  const [order, setOrder] = useState<number>(initial.order)
  const [activeCirculo, setActiveCirculo] = useState<CirculoItem | null>(null)

  const form = useForm<CirculosOrdemData>({
    resolver: zodResolver(circulosOrdemScheme),
    defaultValues: { circulos: [...initial.ativos, ...initial.inativos] },
  })

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  function handleDragStart({ active }: DragStartEvent) {
    const data = active.data.current
    if (data?.type === 'CirculoSort') {
      setActiveCirculo(data.circulo as CirculoItem)
    }
  }

  // onDragOver — só atualiza os states para feedback visual
  // sem form.setValue para não causar loop de re-render
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over || active.id === over.id) return

    const activeInAtivos = ativos.findIndex((c) => c.id === active.id)
    const activeInInativos = inativos.findIndex((c) => c.id === active.id)
    const overInAtivos = ativos.findIndex((c) => c.id === over.id)
    const overInInativos = inativos.findIndex((c) => c.id === over.id)

    const overIsInativoZone =
      over.id === DROPPABLE_INATIVOS || overInInativos !== -1
    const overIsAtivoZone = over.id === DROPPABLE_ATIVOS || overInAtivos !== -1

    // ativo → inativo
    if (activeInAtivos !== -1 && overIsInativoZone) {
      const item = {
        ...ativos[activeInAtivos],
        ativo: false,
        tioAparente: '',
        tioSecreto: '',
      }
      const nextAtivos = ativos.filter((_, i) => i !== activeInAtivos)
      const insertAt = overInInativos !== -1 ? overInInativos : inativos.length
      const nextInativos = [...inativos]
      nextInativos.splice(insertAt, 0, item)
      setAtivos(nextAtivos)
      setInativos(nextInativos)
      setOrder(computeOrder(nextAtivos))
      return
    }

    // inativo → ativo
    if (activeInInativos !== -1 && overIsAtivoZone) {
      const item = { ...inativos[activeInInativos], ativo: true }
      const nextInativos = inativos.filter((_, i) => i !== activeInInativos)
      const insertAt = overInAtivos !== -1 ? overInAtivos : ativos.length
      const nextAtivos = [...ativos]
      nextAtivos.splice(insertAt, 0, item)
      setAtivos(nextAtivos)
      setInativos(nextInativos)
      setOrder(computeOrder(nextAtivos))
    }
  }

  // onDragEnd — sincroniza o form com o estado final
  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCirculo(null)

    // sempre sincroniza ao soltar, independente de onde foi dropado
    form.setValue('circulos', [...ativos, ...inativos])

    if (!over || active.id === over.id) return

    const activeInAtivos = ativos.findIndex((c) => c.id === active.id)
    const overInAtivos = ativos.findIndex((c) => c.id === over.id)
    const activeInInativos = inativos.findIndex((c) => c.id === active.id)
    const overInInativos = inativos.findIndex((c) => c.id === over.id)

    // reordenação dentro dos ativos
    if (activeInAtivos !== -1 && overInAtivos !== -1) {
      const next = arrayMove(ativos, activeInAtivos, overInAtivos)
      setAtivos(next)
      setOrder(computeOrder(next))
      form.setValue('circulos', [...next, ...inativos])
      return
    }

    // reordenação dentro dos inativos
    if (activeInInativos !== -1 && overInInativos !== -1) {
      const next = arrayMove(inativos, activeInInativos, overInInativos)
      setInativos(next)
      form.setValue('circulos', [...ativos, ...next])
    }
  }

  async function handleSave(formData: CirculosOrdemData) {
    setIsUpdating(true)
    try {
      const circulos = formData.circulos.map((c) => ({
        ...c,
        tioAparente:
          c.tioAparente && c.tioAparente !== 'unknown' ? c.tioAparente : null,
        tioSecreto:
          c.tioSecreto && c.tioSecreto !== 'unknown' ? c.tioSecreto : null,
      }))
      await api.put('encontro/atual/1/circulos', { order, circulos })
      toast.success('Ordenação salva!')
    } catch {
      toast.error('Erro ao salvar a ordenação.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* ── Neste Encontro ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-700">
                Neste Encontro
              </h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {ativos.length}
              </span>
            </div>

            <DroppableZone id={DROPPABLE_ATIVOS}>
              <SortableContext
                items={ativos.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {ativos.length === 0 && (
                    <Card className="flex items-center justify-center p-6 text-sm text-zinc-400">
                      Nenhum círculo neste encontro.
                    </Card>
                  )}
                  {ativos.map((circulo, index) => (
                    <CardCirculo
                      key={circulo.id}
                      id={circulo.id}
                      circulo={circulo}
                      index={index}
                      localIndex={index}
                      isAtivo
                      idEncontro={idEncontro}
                      control={form.control}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableZone>
          </section>

          {/* ── Fora deste Encontro ── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-500">
                Fora deste Encontro
              </h2>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                {inativos.length}
              </span>
            </div>

            <DroppableZone id={DROPPABLE_INATIVOS}>
              <SortableContext
                items={inativos.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {inativos.length === 0 && (
                    <Card className="flex items-center justify-center p-6 text-sm text-zinc-400">
                      Todos os círculos estão neste encontro.
                    </Card>
                  )}
                  {inativos.map((circulo, index) => {
                    const globalIndex = ativos.length + index
                    return (
                      <CardCirculo
                        key={circulo.id}
                        id={circulo.id}
                        circulo={circulo}
                        index={globalIndex}
                        localIndex={index}
                        isAtivo={false}
                        idEncontro={idEncontro}
                        control={form.control}
                      />
                    )
                  })}
                </div>
              </SortableContext>
            </DroppableZone>
          </section>

          {/* ── DragOverlay — card completo ── */}
          <DragOverlay>
            {activeCirculo && (
              <CardCirculoBase
                circulo={activeCirculo}
                isAtivo={activeCirculo.ativo}
                idEncontro={idEncontro}
                isOverlay
              />
            )}
          </DragOverlay>
        </DndContext>

        {/* ── Salvar ── */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isUpdating} className="w-40">
            {isUpdating ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
