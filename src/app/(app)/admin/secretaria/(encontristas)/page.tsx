'use client'

import { EncontristasSecreTable } from './(table-encontreiros)/encontristas-secre-table'

export default function SecretariaEncontristas() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">Encontristas</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os encontristas desse Encontrão. Essa informação é{' '}
              <strong>confidencial</strong> e de uso da externa, por favor não
              compartilhe.
            </span>
          </div>
        </div>
        <EncontristasSecreTable />
      </div>
    </div>
  )
}
