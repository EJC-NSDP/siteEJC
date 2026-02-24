import type { Aniversariantes } from '@/app/api/pessoa/aniversariantes/get-aniversariantes'

import { CardAniversariante } from './CardAniversariante'

async function getAniversariantes() {
  const response: Aniversariantes[] = await fetch(
    `${process.env.NEXTAUTH_URL}/api/pessoa/aniversariantes`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

export default async function Aniversariantes() {
  const aniversariantes = await getAniversariantes()

  return (
    <div className="h-full w-full">
      <div className="pb-8">
        <h1 className="text-tertiary text-2xl font-bold">Aniversariantes</h1>
        <span className="text-base font-normal text-zinc-500">
          Lista de todos os aniversariantes ativos no encontro nessa semana
        </span>
      </div>

      {aniversariantes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-20 text-center">
          <span className="text-5xl">🎂</span>
          <span className="text-lg font-semibold text-zinc-700">
            Nenhum aniversariante essa semana
          </span>
          <span className="text-sm text-zinc-400">
            Volte na semana que vem!
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {aniversariantes.map((aniversariante, index) => (
            <CardAniversariante key={index} aniversariante={aniversariante} />
          ))}
        </div>
      )}
    </div>
  )
}
