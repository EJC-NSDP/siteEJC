import { CardsNovoEncontro } from './CardsNovoEncontro'

import type { EncontraoActions } from '@/app/api/encontro/atual/[ignorar]/get-encontrao-actions/get-encontrao-actions'

export default async function DirigentesCriarEncontro() {
  const actions: EncontraoActions = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontro/atual/1/get-encontrao-actions`,
    {
      cache: 'no-store',
    },
  ).then(async (res) => await res.json())

  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">
              Criar Novo Encontrão
            </h1>
            <span className="text-base font-normal text-zinc-500">
              Execute todas as ações abaixo para poder criar um novo Encontrão
            </span>
          </div>
        </div>
        <CardsNovoEncontro
          ultimoEncontro={actions.ultimoEncontro}
          encontristas={actions.encontristas}
          cartas={actions.cartas}
          montagem={actions.montagem}
        />
      </div>
    </div>
  )
}
