'use client'

import { DirisBpsSecreTable } from './(table-diris-bps)/diris-bps-secre-table'

export default function SecretariaDirisBps() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Diris e BPs</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista dos diris e bps deste ano.
            </span>
          </div>
        </div>
        <DirisBpsSecreTable />
      </div>
    </div>
  )
}
