'use client'

import { CirculosTable } from './(table-circulos)/circulos-table'

export default function DirigenteCirculos() {
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Círculos</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os círculos
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            {/* <Link href="/api/export/encontrista">
              <Button variant="secondary">
                <div className="flex items-center justify-center gap-2 lg:w-40">
                  <Download className="h-4 w-4 text-tertiary" />
                  <span className="hidden lg:flex">Gerar XLSX</span>
                </div>
              </Button>
            </Link> */}
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
      <CirculosTable />
    </div>
  )
}
