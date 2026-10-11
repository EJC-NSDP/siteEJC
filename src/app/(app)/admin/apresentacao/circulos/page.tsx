'use client'

import { useQuery } from '@tanstack/react-query'

import type { CirculosResponse } from '@/app/api/encontro/atual/[ignorar]/circulos/get-circulos'
import type { CurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/axios'
import { getCurrentEncontro } from '@/utils/fetch-this-encontro'
import { ordenarCirculos } from '@/utils/ordenar-circulos'

import { SortCirculos } from './sort-circulos'

export interface CirculoEncontro {
  cor: string
  tioAparente: string
  tioSecreto: string
}

async function getCirculos() {
  const response: CirculosResponse = await api
    .get(`encontro/atual/1/circulos`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const sortedCirculos = ordenarCirculos(
    response.order.toString(),
    response.circulos,
  )

  const orderedResponse: CirculosResponse = {
    order: response.order,
    circulos: sortedCirculos,
  }

  return orderedResponse
}

export default function Temas() {
  const { data: circulosEncontrao, isLoading: isLoadingCirculos } =
    useQuery<CirculosResponse>({
      queryKey: ['circulos'],
      queryFn: () => getCirculos(),
    })

  const { data: encontroAtual, isLoading: isLoadingEncontro } =
    useQuery<CurrentEncontro | null>({
      queryKey: ['encontro-atual'],
      queryFn: () => getCurrentEncontro(),
    })

  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">
              Ordenação dos Círculos
            </h1>
            <span className="text-base font-normal text-zinc-500">
              Ordena os círculos e adiciona quem são os tios aparentes e
              secretos. Atenção só preencha essa informação depois que os tios
              forem revelados.
            </span>
          </div>
        </div>
        {isLoadingCirculos || isLoadingEncontro ? (
          <div className="space-y-8">
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28 bg-zinc-200" />
                <Skeleton className="h-5 w-6 rounded-full bg-zinc-200" />
              </div>
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full bg-zinc-200" />
                ))}
              </div>
            </section>
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-36 bg-zinc-200" />
                <Skeleton className="h-5 w-6 rounded-full bg-zinc-200" />
              </div>
              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full bg-zinc-200" />
                ))}
              </div>
            </section>
          </div>
        ) : (
          circulosEncontrao &&
          encontroAtual?.id && (
            <SortCirculos
              circulosEncontro={circulosEncontrao}
              idEncontro={encontroAtual.id}
            />
          )
        )}
      </div>
    </div>
  )
}
