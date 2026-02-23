import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import type { Aniversariantes } from '@/app/api/pessoa/aniversariantes/get-aniversariantes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/get-initials'

dayjs.locale('pt-br')

export interface CardAniversarianteProps {
  aniversariante: Aniversariantes
}

export function CardAniversariante({
  aniversariante,
}: CardAniversarianteProps) {
  const [dia, mes] = aniversariante.dataNasc.split('/')
  const mesAbrev = dayjs(`2000-${mes}-01`).format('MMM').toUpperCase()

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm">
      {/* Data */}
      <div className="bg-primary/10 flex w-14 shrink-0 flex-col items-center justify-center rounded-xl py-2">
        <span className="text-primary text-2xl leading-none font-bold">
          {dia}
        </span>
        <span className="text-primary text-xs font-semibold">{mesAbrev}</span>
      </div>

      {/* Avatar */}
      <Avatar className="size-12 shrink-0">
        <AvatarImage src={aniversariante.avatarUrl || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {getInitials(aniversariante.nome)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-semibold text-zinc-800">
          {aniversariante.nome}
          {aniversariante.apelido && (
            <span className="ml-1 font-normal text-zinc-400">
              ({aniversariante.apelido})
            </span>
          )}
        </span>
        <div className="mt-0.5 flex items-center gap-3">
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
  )
}
