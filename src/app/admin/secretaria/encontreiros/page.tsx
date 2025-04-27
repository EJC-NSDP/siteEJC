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
              Lista de todos os encontreiros participando desse Encontrão.
            </span>
          </div>
        </div>
        <EncontreirosSecreTable />
      </div>
    </div>
  )
}
