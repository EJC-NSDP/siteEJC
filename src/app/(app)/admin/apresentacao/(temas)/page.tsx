import type { TemasEncontroData } from '@/app/api/encontro/atual/[ignorar]/temas/get-temas'

import { TemasForm } from './temas-form'

async function getTemas() {
  const response: TemasEncontroData = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontro/atual/1/temas`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

export default async function Temas() {
  const temas = await getTemas()

  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">
              Divulgação dos Temas
            </h1>
            <span className="text-base font-normal text-zinc-500">
              Divulgue para o encontro qual será o tema fantasia e o espiritual.
              Atenção só preencha essa informação depois que o tema foi
              revelado.
            </span>
          </div>
        </div>
        <TemasForm data={temas} />
      </div>
    </div>
  )
}
