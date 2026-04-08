'use client'

import { Pencil } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { DirisBpsTable } from './(table-diris-bps)/diris-bps-secre-table'

export default function DirisBps() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">Diris e BPs</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista dos Dirigentes e Bons Pastores deste ano.
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/dirigente/diris-bps/editar-dirigentes">
              <Button>
                <div className="flex items-center justify-center gap-2 lg:w-40">
                  <Pencil className="size-4" />
                  <span className="hidden lg:flex">Editar Dirigentes</span>
                </div>
              </Button>
            </Link>
            {/* <Link href="/admin/dirigente/diris-bps/editar-bps">
              <Button>
                <div className="flex items-center justify-center gap-2 lg:w-40">
                  <Pencil className="size-4" />
                  <span className="hidden lg:flex">Editar BPs</span>
                </div>
              </Button>
            </Link> */}
          </div>
        </div>
        <DirisBpsTable />
      </div>
    </div>
  )
}
