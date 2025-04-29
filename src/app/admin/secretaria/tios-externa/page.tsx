'use client'

import { TiosExternaSecreTable } from './(table-tios-externa)/tios-externa-secre-table'

export default function SecretariaTiosExterna() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">
              Tios de Externa
            </h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os tios de externa participando desse Encontrão,
              caso tenha alguma informação incorreta altere com a equipe de
              externa.
            </span>
          </div>
        </div>
        <TiosExternaSecreTable />
      </div>
    </div>
  )
}
