import { Suspense } from 'react'

import { getCurrentEncontro } from '@/app/api/encontro/atual/[ignorar]/get-current-encontro/get-current-encontro'
import { CardLoading } from '@/components/CardLoading'
import { CreateEncontristaContextProvider } from '@/context/CreateEncontristaContext'

import { ParticipeForm } from './(form)/ParticipeForm'

export default async function ParticipePage() {
  const encontro = await getCurrentEncontro()

  const dataInicio: string | null =
    encontro && encontro.numeroCirculos > 0
      ? encontro.dataInicio.toISOString().split('T')[0]
      : null

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center pt-24 pb-32 text-zinc-700">
          <div className="w-card flex">
            <CardLoading />
          </div>
        </div>
      }
    >
      <CreateEncontristaContextProvider>
        <ParticipeForm dataInicio={dataInicio} />
      </CreateEncontristaContextProvider>
    </Suspense>
  )
}
