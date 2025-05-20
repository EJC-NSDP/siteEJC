'use client'

import { EncontreirosSecreTable } from './(table-encontreiros)/encontreiros-secre-table'

export default function SecretariaEncontreiros() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Encontreiros</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os encontreiros que estão participando deste
              Encontrão. Para alterar os dados de um encontreiro, peça para ele
              editar em seu perfil ou peça para um dirigente alterar.
            </span>
          </div>
        </div>
        <EncontreirosSecreTable />
      </div>
    </div>
  )
}
