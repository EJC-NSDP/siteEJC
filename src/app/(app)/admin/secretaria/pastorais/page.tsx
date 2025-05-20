'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { PastoraisSecreTable } from './(table-pastorais)/pastorais-secre-table'

export default function SecretariaPastorais() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Pastorais</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todas as Pastorais deste ano.
            </span>
          </div>
          <Link href="/admin/secretaria/pastorais/adicionar-pastoral">
            <Button>
              <div className="flex items-center justify-center gap-2 lg:w-40">
                <Plus className="size-4" />
                <span className="hidden lg:flex">Adicionar Pastoral</span>
              </div>
            </Button>
          </Link>
        </div>

        <PastoraisSecreTable />
      </div>
    </div>
  )
}
