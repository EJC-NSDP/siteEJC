'use client'

import type { CarroPendencias } from '@/app/api/encontro/atual/[ignorar]/pendencias/get-pendencias'
import { CarroEmpty } from '@/components/Table/CarroEmpty'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { PendenciasSkeleton } from './PendenciasSkeleton'
import { TioExterna } from './TioExterna'

async function getCarrosComPendencias() {
  const response: CarroPendencias[] = await api
    .get(`encontro/atual/1/pendencias`)
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function TiosExterna() {
  const { data: carrosPendencias, isLoading: isLoadingPendencias } = useQuery<
    CarroPendencias[]
  >({
    queryKey: ['carrosPendencias'],
    queryFn: () => getCarrosComPendencias(),
  })

  return (
    <>
      {isLoadingPendencias && <PendenciasSkeleton />}
      <div className="grid grid-cols-2">
        {carrosPendencias && carrosPendencias.length === 0 && <CarroEmpty />}

        {carrosPendencias &&
          carrosPendencias.map((carroPendencia) => {
            return <TioExterna key={carroPendencia.id} carro={carroPendencia} />
          })}
      </div>
    </>
  )
}
