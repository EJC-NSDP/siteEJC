import type {
  CirculoQuadrante,
  EquipeBPsQuadrante,
  EquipePalestrantesQuadrante,
  EquipePastoraisQuadrante,
  EquipeQuadrante,
  EquipeTiosExternaQuadrante,
} from '@/@types/quadrante'
import { QuadranteGenerator } from './QuadranteGenerator'

async function getCirculos() {
  const circulos = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/quadrante/encontrista`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return circulos
}

async function getEquipes() {
  const equipes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/quadrante/encontreiro`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return equipes
}

async function getTioExterna() {
  const tiosExterna = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/quadrante/tio-externa`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return tiosExterna
}

async function getPalestrantes() {
  const palestrantes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/quadrante/palestrante`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return palestrantes
}

async function getBPs() {
  const bonsPastores = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/quadrante/bom-pastor`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return bonsPastores
}

async function getPastorais() {
  const pastorais = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/quadrante/pastoral`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return pastorais
}

export default async function Quadrante() {
  const circulos: CirculoQuadrante[] = await getCirculos()
  const equipes: EquipeQuadrante[] = await getEquipes()
  const tiosExterna: EquipeTiosExternaQuadrante = await getTioExterna()
  const palestrantes: EquipePalestrantesQuadrante = await getPalestrantes()
  const bonsPastores: EquipeBPsQuadrante = await getBPs()
  const pastorais: EquipePastoraisQuadrante = await getPastorais()

  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Quadrante</h1>
            <span className="text-base font-normal text-zinc-500">
              Personalize seu quadrante aqui para o tema desse encontro
            </span>
          </div>
          {/* <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Link href="/api/export/encontrista">
              <Button variant="secondary">
                <div className="flex items-center justify-center gap-2 lg:w-40">
                  <Download className="h-4 w-4 text-tertiary" />
                  <span className="hidden lg:flex">Gerar XLSX</span>
                </div>
              </Button>
            </Link>

            <Link href="/participe">
              <Button>
                <div className="flex items-center justify-center gap-2 lg:w-40">
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:flex">Novo Encontrista</span>
                </div>
              </Button>
            </Link>
          </div> */}
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
      {/* <QuadranteForm /> */}
      <QuadranteGenerator
        circulos={circulos}
        equipes={equipes}
        tiosExterna={tiosExterna}
        palestrantes={palestrantes}
        bonsPastores={bonsPastores}
        pastorais={pastorais}
      />
    </div>
  )
}
