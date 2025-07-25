'use client'

import { Button } from '@/components/ui/button'
import { Download, Plus } from 'lucide-react'
import Link from 'next/link'
import { EncontreirosMontagemTable } from './(table-montagem)/encontreiros-montagem-table'

export default function Montagem() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Montagem</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os encontreiros ativos para a próxima montagem
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Link href="/api/export/montagem/encontreiros">
              <Button variant="secondary">
                <div className="flex items-center justify-center gap-2 lg:w-auto">
                  <Download className="h-4 w-4 text-tertiary" />
                  <span className="hidden lg:flex">Baixar Encontreiros</span>
                </div>
              </Button>
            </Link>
            <Link href="/admin/dirigente/encontreiro/novo">
              <Button>
                <div className="flex items-center justify-center gap-2 lg:w-40">
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:flex">Novo Encontreiro</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-9">
        <div className="col-span-9 lg:col-span-7">
          <EncontreirosMontagemTable />
        </div>
        <div className="col-span-9 lg:col-span-2">
          {/* <CardsEquipesMontagem /> */}
        </div>
      </div>
    </div>
  )
}
