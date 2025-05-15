import type { EncontreiroQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'
import { idPertenceARosa } from '@/utils/pertence'
import { Anton } from 'next/font/google'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
})

interface QuadranteEquipePageProps {
  title: string
  description: string
  integrantes: EncontreiroQuadrante[]
}

export function QuadranteEquipePage({
  title,
  description,
  integrantes,
}: QuadranteEquipePageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-col items-center gap-4 pb-4 text-center">
        <h1
          className={cn('text-7xl font-bold tracking-wider', anton.className)}
        >
          {title.toUpperCase()}
        </h1>
        <h2 className="w-4/5 text-pretty text-lg italic text-zinc-800">
          {description}
        </h2>
      </div>

      <div className="mt-0 flex flex-col gap-8">
        {/* Grid de integrantes */}
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-8">
          {integrantes.map((member, index) => {
            const allCoord =
              member.equipe === 'dirigente' ||
              member.equipe === 'BP' ||
              idPertenceARosa(member.equipe)
            const onlyCoord = member.coord && !allCoord

            return (
              <div
                key={index}
                className="my-0 flex items-center justify-start px-8 py-0 text-base"
              >
                <div
                  className={cn(
                    'flex w-full flex-col',
                    onlyCoord && 'font-bold',
                  )}
                >
                  <span
                    className={cn(
                      'flex w-full flex-col',
                      allCoord && 'font-bold',
                    )}
                  >
                    {member.nome}
                  </span>
                  <span>Apelido: {member.apelido}</span>
                  <span>Encontrão: {member.encontro}º EJC</span>
                  <span>Telefone: {member.celular}</span>
                  <span>Bairro: {member.bairro}</span>
                  <span>
                    Instagram:{' '}
                    {member.instagram === '-' ? '-' : `@${member.instagram}`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
