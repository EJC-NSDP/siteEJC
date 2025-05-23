'use client'

import type { CarroFromEncontro } from '@/app/api/encontro/atual/[ignorar]/carros/get-carros'
import type { CardEncontristaResponse } from '@/app/api/encontro/atual/[ignorar]/confirmados-card/get-confirmados-card'
import { api } from '@/lib/axios'
import { hasDraggableData } from '@/utils/draggable-data'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  CardEncontristaCarro,
  type SortableEncontristaCarro,
} from './CardEncontristasCarro'
import { Carros } from './Carros'
import { ListaConfirmadosSemCarro } from './ListaConfirmadosSemCarro'

export type CarroId = string

async function getCarros() {
  const response: CarroFromEncontro[] = await api
    .get(`encontro/atual/1/carros`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

async function getConfirmados() {
  const response: CardEncontristaResponse[] = await api
    .get(`encontro/atual/1/confirmados-card`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const sortableResponse: SortableEncontristaCarro[] = response.map(
    (encontrista) => {
      return {
        id: encontrista.id,
        carroId: encontrista.idCarro ? encontrista.idCarro : '0',
        content: {
          id: encontrista.id,
          nome: encontrista.nome,
          zona: encontrista.zona,
          bairro: encontrista.bairro,
          rua: encontrista.rua,
          endNumero: encontrista.endNumero,
          endComplemento: encontrista.endComplemento,
          corCirculo: encontrista.corCirculo,
        },
      }
    },
  )

  return sortableResponse
}

async function updateCarro(encontristaId: string, carroId: string) {
  return await api.patch(`encontrista/${encontristaId}/change-carro/${carroId}`)
}

export default function AlocacaoCarros() {
  const { data: confirmadosCard } = useQuery<SortableEncontristaCarro[]>({
    queryKey: ['confirmados'],
    queryFn: () => getConfirmados(),
  })
  const { data: carrosEncontro } = useQuery<CarroFromEncontro[]>({
    queryKey: ['carros'],
    queryFn: () => getCarros(),
  })
  const [encontristas, setEncontristas] = useState<SortableEncontristaCarro[]>(
    [],
  )
  const [carros, setCarros] = useState<CarroFromEncontro[]>([])

  const [activeEncontrista, setActiveEncontrista] =
    useState<SortableEncontristaCarro | null>(null)

  useEffect(() => {
    if (confirmadosCard) {
      setEncontristas(confirmadosCard)
    }
  }, [confirmadosCard])

  useEffect(() => {
    if (carrosEncontro) {
      setCarros(carrosEncontro)
    }
  }, [carrosEncontro])

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return
    const data = event.active.data.current
    if (data) {
      setActiveEncontrista(data.encontrista)
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveEncontrista(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    await updateCarro(activeId.toString(), overId.toString())

    if (!hasDraggableData(active)) return

    const activeData = active.data.current

    if (activeId === overId) return

    const isActiveCarro = activeData?.type === 'Carro'
    if (!isActiveCarro) return

    setCarros((carros) => {
      const activeCarroIndex = carros.findIndex(
        (carro) => carro.id === activeId,
      )

      const overCarroIndex = carros.findIndex((carro) => carro.id === overId)

      return arrayMove(carros, activeCarroIndex, overCarroIndex)
    })
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    if (!hasDraggableData(active) || !hasDraggableData(over)) return

    const activeData = active.data.current
    const overData = over.data.current

    const isActiveEncontrista = activeData?.type === 'Encontrista'

    if (!isActiveEncontrista) return

    const isOverACarro = overData?.type === 'Carro'

    // Im dropping a Encontrista over a Carro
    if (isActiveEncontrista && isOverACarro) {
      setEncontristas((encontristas) => {
        const activeIndex = encontristas.findIndex((t) => t.id === activeId)
        const activeEncontrista = encontristas[activeIndex]
        if (activeEncontrista) {
          activeEncontrista.carroId = overId.toString()
          return arrayMove(encontristas, activeIndex, activeIndex)
        }
        return encontristas
      })
    }
  }

  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between gap-8 pb-8">
          <div className="px-4">
            <h1 className="text-2xl font-bold text-tertiary">
              Alocação de Carros
            </h1>
            <span className="text-base font-normal text-zinc-500">
              Montagem dos círculos e distribuição dos encontristas
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 lg:flex-row"></div>
        </div>
      </div>

      <div className="grid grid-cols-9">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          collisionDetection={closestCenter}
        >
          <>
            <div className="col-span-9 lg:col-span-6">
              {carros && encontristas && (
                <Carros carros={carros} encontristas={encontristas} />
              )}
            </div>
            <div className="col-span-9 lg:col-span-3">
              {encontristas && (
                <ListaConfirmadosSemCarro encontristas={encontristas} />
              )}
            </div>
          </>

          <DragOverlay>
            {activeEncontrista && (
              <CardEncontristaCarro encontrista={activeEncontrista} isOverlay />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
