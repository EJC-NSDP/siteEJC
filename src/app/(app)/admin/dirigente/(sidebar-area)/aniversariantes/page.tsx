import type { Aniversariantes } from '@/app/api/pessoa/aniversariantes/get-aniversariantes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/get-initials'

async function getAniversariantes() {
  const response: Aniversariantes[] = await fetch(
    `${process.env.NEXTAUTH_URL}/api/pessoa/aniversariantes`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

export default async function Aniversariantes() {
  const aniversariantes = await getAniversariantes()

  return (
    <div className="w-full h-full">
      <div className="pb-8">
        <h1 className="text-tertiary text-2xl font-bold">Aniversariantes</h1>
        <span className="text-base font-normal text-zinc-500">
          Lista de todos os aniversariantes ativos no encontro nessa semana
        </span>
      </div>

      {aniversariantes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-20 text-center">
          <span className="text-5xl">🎂</span>
          <span className="text-lg font-semibold text-zinc-700">
            Nenhum aniversariante essa semana
          </span>
          <span className="text-sm text-zinc-400">
            Volte na semana que vem!
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {aniversariantes.map((aniversariante, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm"
            >
              {/* Data */}
              <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 py-2">
                <span className="text-xs font-semibold text-primary">
                  {aniversariante.dataNasc.split('/')[1]}
                </span>
                <span className="text-2xl font-bold text-primary leading-none">
                  {aniversariante.dataNasc.split('/')[0]}
                </span>
              </div>

              {/* Avatar */}
              <Avatar className="size-12 shrink-0">
                <AvatarImage src={aniversariante.avatarUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(aniversariante.nome)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-zinc-800 truncate">
                  {aniversariante.nome}
                  {aniversariante.apelido && (
                    <span className="ml-1 font-normal text-zinc-400">
                      ({aniversariante.apelido})
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-sm text-zinc-500">
                    🎉 {aniversariante.idade} anos
                  </span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-sm text-zinc-500">
                    {aniversariante.numeroEncontro}º EJC
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}