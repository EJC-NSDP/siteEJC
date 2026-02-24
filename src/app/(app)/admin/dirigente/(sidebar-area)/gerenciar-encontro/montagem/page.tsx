'use client'

import { Download, Megaphone, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { EncontreirosMontagemTable } from './(table-montagem)/encontreiros-montagem-table'
import { AlertDialogAplicarContent } from './AlertDialogAplicarContent'
import { CardsEquipesMontagem } from './CardsEquipesMontagem'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export default function Montagem() {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="w-ful h-full">
        <div className="pb-4">
          <div className="flex items-center justify-between pb-8">
            <div className="">
              <h1 className="text-tertiary text-2xl font-bold">Montagem</h1>
              <span className="text-base font-normal text-zinc-500">
                Lista de todos os encontreiros ativos para a próxima montagem
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline">
                  <div className="flex items-center justify-center gap-2">
                    <Megaphone className="size-4" />
                    <span className="hidden lg:flex">Divulgar Montagem</span>
                  </div>
                </Button>
              </AlertDialogTrigger>

              <Link href="/api/export/montagem/encontreiros">
                <Button variant="secondary">
                  <div className="flex items-center justify-center gap-2">
                    <Download className="size-4" />
                    <span className="hidden lg:flex">Baixar Encontreiros</span>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/dirigente/encontreiro/novo">
                <Button>
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="size-4" />
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
            <CardsEquipesMontagem />
          </div>
        </div>
      </div>
      <AlertDialogAplicarContent openFn={setOpen} />
    </AlertDialog>
  )
}
