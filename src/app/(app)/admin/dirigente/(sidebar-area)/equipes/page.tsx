import { Crown } from 'lucide-react'
import Link from 'next/link'

import type { EquipeMontagemAggregated } from '@/app/api/domains/equipes/montagem/aggregated/[value]/get-equipe'
import type { EquipesMontagemAggregated } from '@/app/api/domains/equipes/montagem/aggregated/get-equipes'
import { cn } from '@/lib/utils'
import { getEquipeColor, getTextEquipeColor } from '@/utils/fetch-color'

async function getEquipes() {
  const response: EquipesMontagemAggregated[] = await fetch(
    `${process.env.NEXTAUTH_URL}/api/domains/equipes/montagem/aggregated`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

async function getEquipeDetail(value: string) {
  const response: EquipeMontagemAggregated = await fetch(
    `${process.env.NEXTAUTH_URL}/api/domains/equipes/montagem/aggregated/${value}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

export default async function EquipesEncontroAtual() {
  const equipes = (await getEquipes()).filter(
    (equipe) => equipe.equipeValue !== 'sem_equipe',
  )

  const equipesComDetalhe = await Promise.all(
    equipes.map(async (equipe) => {
      const detalhe = await getEquipeDetail(equipe.equipeValue)
      return { ...equipe, detalhe }
    }),
  )

  return (
    <div className="w-full h-full">
      <div className="pb-8">
        <h1 className="text-tertiary text-2xl font-bold">Equipes</h1>
        <span className="text-base font-normal text-zinc-500">
          Lista de todas as equipes do encontro atual
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {equipesComDetalhe.map((equipe) => {
          const bgColor = getEquipeColor(equipe.equipeValue)
          const textColor = getTextEquipeColor(equipe.equipeValue)
          const isDark =
            equipe.equipeValue === 'ordem' ||
            equipe.equipeValue === 'sala' ||
            equipe.equipeValue === 'rosa' ||
            equipe.equipeValue === 'teatro'
          const titleColor = isDark ? 'text-white' : 'text-zinc-700'

          return (
            <Link
              href={`/admin/equipe/${equipe.equipeValue}`}
              key={equipe.equipeValue}
            >
              <div
                className={cn(
                  'flex flex-col justify-between rounded-2xl px-5 py-5 h-full min-h-28 transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer',
                  bgColor,
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'font-bold text-base leading-tight',
                      titleColor,
                    )}
                  >
                    {equipe.equipeLabel}
                  </span>
                  <span
                    className={cn(
                      'text-2xl font-extrabold leading-none',
                      textColor,
                    )}
                  >
                    {equipe.detalhe.total}
                  </span>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-1.5 mt-3 text-xs font-medium',
                    titleColor,
                  )}
                >
                  <Crown className="size-3" />
                  <span>
                    {equipe.detalhe.coordDone ? 'Coord. completa' : 'Sem coord.'}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}