'use client'

import { PrintEncontristasRecepcaoXls } from '@/components/Xls/PrintEncontristasRecepcaoXls'

import { EncontristasRecepcaoTable } from './(table-encontristas)/encontristas-recepcao-table'

export default function RecepcaoEncontristas() {
  return (
    <div className="h-full w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-tertiary text-2xl font-bold">Encontristas</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os encontristas confirmados deste Encontrão.
            </span>
          </div>
          <PrintEncontristasRecepcaoXls />
        </div>

        <EncontristasRecepcaoTable />
      </div>
    </div>
  )
}
