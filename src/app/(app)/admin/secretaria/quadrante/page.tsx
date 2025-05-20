import { Button } from '@/components/ui/button'
import { fetchConfigData } from '@/lib/quadrante/fetchAllData'
import Link from 'next/link'
import { QuadranteForm } from './QuadranteForm'

export default async function Quadrante() {
  const config = await fetchConfigData()
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between gap-12 pb-8">
          <div>
            <h1 className="text-2xl font-bold text-tertiary">Quadrante</h1>
            <span className="text-balance text-base font-normal text-zinc-500">
              Adicione as capas, cartas e cartazes deste Encontrão.
            </span>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <Link href="/quadrante/imprimir">
              <Button className="w-full">
                <span className="flex lg:hidden">Impressão</span>
                <span className="hidden lg:flex">Quadrante para imprimir</span>
              </Button>
            </Link>

            <Link href="/quadrante/completo">
              <Button className="w-full">
                <span className="flex lg:hidden">Completo</span>
                <span className="hidden lg:flex">Quadrante completo</span>
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
      <QuadranteForm config={config} />
    </div>
  )
}
