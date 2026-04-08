'use client'

import { PastoraisSecreTable } from './(table-pastorais)/pastorais-secre-table'

export default function SecretariaPastorais() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">Pastorais</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todas as Pastorais deste ano. Caso veja que tem alguém
              errado peça para um BP corrigir.
            </span>
          </div>
        </div>

        <PastoraisSecreTable />
      </div>
    </div>
  )
}
