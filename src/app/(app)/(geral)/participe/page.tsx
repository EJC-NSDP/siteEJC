import { Suspense } from 'react'

import { CardLoading } from '@/components/CardLoading'
import { CreateEncontristaContextProvider } from '@/context/CreateEncontristaContext'
import { getCurrentEncontroDate } from '@/utils/fetch-this-encontro'

import { ParticipeForm } from './(form)/ParticipeForm'

export default async function ParticipePage() {
  const dataEncontro = await getCurrentEncontroDate()

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
        <ParticipeForm dataInicio={dataEncontro} />
      </CreateEncontristaContextProvider>
    </Suspense>
  )
}
