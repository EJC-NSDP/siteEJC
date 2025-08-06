import type { EquipesMontagemAggregated } from '@/app/api/domains/equipes/montagem/aggregated/get-equipes'
import { getEquipeColor } from '@/utils/fetch-color'
import Link from 'next/link'

async function getEquipes() {
  const response: EquipesMontagemAggregated[] = await fetch(
    `${process.env.NEXTAUTH_URL}/api/domains/equipes/montagem/aggregated`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

export default async function EquipesEncontroAtual() {
  const equipes = await (
    await getEquipes()
  ).filter((equipe) => equipe.equipeValue !== 'sem_equipe')

  console.log(equipes)
  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Equipes</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todas as equipes do encontro atual
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {equipes.map((equipe) => {
          const equipeColor = getEquipeColor(equipe.equipeValue)
          return (
            <Link
              href={`/admin/equipe/${equipe.equipeValue}`}
              key={equipe.equipeValue}
              className="flex items-center gap-4 hover:underline"
            >
              <div className={`size-3 rounded-full ${equipeColor}`} />
              <span className="text-lg">{equipe.equipeLabel}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
