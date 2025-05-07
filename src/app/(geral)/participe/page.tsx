import { CardLoading } from '@/components/CardLoading'
import { CreateEncontristaContextProvider } from '@/context/CreateEncontristaContext'
import { getCurrentEncontroDate } from '@/utils/fetch-this-encontro'
import { Suspense } from 'react'
import { ParticipeForm } from './(form)/ParticipeForm'

export default async function ParticipePage() {
  const dataEncontro = await getCurrentEncontroDate()

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center pb-32 pt-24 text-zinc-700">
          <div className="flex w-card">
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
