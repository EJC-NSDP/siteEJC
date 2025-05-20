import type { EncontreiroQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'
import { idPertenceARosa } from '@/utils/pertence'
import { QuadranteTitlePage } from './QuadranteTitlePage'

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
    <QuadranteTitlePage title={title} description={description}>
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
              className="my-0 flex items-start justify-start px-8 py-0 text-base"
            >
              <div
                className={cn(
                  'flex w-full flex-col text-3xl',
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
    </QuadranteTitlePage>
  )
}
