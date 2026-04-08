'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { PastoraisTable } from './(table-pastorais)/pastorais-table'

export default function Pastorais() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">Pastorais</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todas as Pastorais deste ano.
            </span>
          </div>
          <Link href="/admin/bp/adicionar-pastoral">
            <Button>
              <div className="flex items-center justify-center gap-2 lg:w-40">
                <Plus className="size-4" />
                <span className="hidden lg:flex">Adicionar Pastoral</span>
              </div>
            </Button>
          </Link>
        </div>

        <PastoraisTable />
      </div>
    </div>
  )
}
