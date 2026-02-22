'use client'

import { Download, Plus } from 'lucide-react'
import Link from 'next/link'

import { EncontreirosTable } from './(table-encontreiros)/encontreiros-table'

import { Button } from '@/components/ui/button'

export default function Dirigente() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-tertiary text-2xl font-bold">Encontreiros</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os encontreiros
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Link href="/api/export/convidados-especiais">
              <Button variant="secondary">
                <div className="flex items-center justify-center gap-2 lg:w-auto">
                  <Download className="text-tertiary h-4 w-4" />
                  <span className="hidden lg:flex">
                    Baixar Convidados Especiais
                  </span>
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
        {/* <Accordion type="single" collapsible>
          <AccordionItem
            value="graficos"
            className="rounded-xl border-none bg-white px-4"
          >
            <AccordionTrigger>
              <div className="flex items-center gap-4">
                <BarChart4 className="h-6 w-6 text-zinc-700" />
                <span className="font-bold text-zinc-700">Gráficos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              Em breve teremos os Gráficos aqui
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}
      </div>
      <EncontreirosTable />
    </div>
  )
}
