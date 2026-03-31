'use client'

import { useQuery } from '@tanstack/react-query'

import type { CirculosResponse } from '@/app/api/encontro/atual/[ignorar]/circulos/get-circulos'
import type { CurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
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
  const { data: circulosEncontrao } = useQuery<CirculosResponse>({
    queryKey: ['circulos'],
    queryFn: () => getCirculos(),
  })

  const { data: encontroAtual } = useQuery<CurrentEncontro | null>({
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
        {circulosEncontrao && encontroAtual?.id && (
          <SortCirculos
            circulosEncontro={circulosEncontrao}
            idEncontro={encontroAtual.id}
          />
        )}
      </div>
    </div>
  )
}
