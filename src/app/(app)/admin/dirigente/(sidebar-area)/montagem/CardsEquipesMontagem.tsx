import type { EquipesMontagemAggregated } from '@/app/api/domains/equipes/montagem/aggregated/get-equipes'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { CardEquipeMontagem } from './CardEquipeMontagem'

async function getEquipes() {
  const response: EquipesMontagemAggregated[] = await api
    .get('domains/equipes/montagem/aggregated')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  return response
}

export function CardsEquipesMontagem() {
  const { data: equipes } = useQuery<EquipesMontagemAggregated[]>({
    queryKey: ['equipes'],
    queryFn: () => getEquipes(),
  })
  return (
    <div className="flex flex-col gap-4 pl-6">
      {equipes &&
        equipes.map((equipe) => {
          return (
            <CardEquipeMontagem
              key={equipe.equipeValue}
              value={equipe.equipeValue}
            />
          )
        })}
    </div>
  )
}
