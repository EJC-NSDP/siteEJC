import type { EquipeSecre } from '@/app/api/secretaria/equipe/get-equipes-secre'
import { EquipesForm } from './(form)/(pageComponents)/EquipeForm'

async function getEquipes() {
  const equipes = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/equipe`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return equipes
}

export default async function SecretariaEquipes() {
  const equipes: EquipeSecre[] = await getEquipes()

  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">Equipes</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos as equipes do encontrão e suas descrições.
            </span>
          </div>
        </div>
        <EquipesForm equipes={equipes} />
      </div>
    </div>
  )
}
