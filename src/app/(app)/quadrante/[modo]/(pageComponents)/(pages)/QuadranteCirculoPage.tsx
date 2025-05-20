import type { EncontristaQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'
import { getCirculoTitleColor } from '@/utils/fetch-color'
import Image from 'next/image'

import { QuadranteOnePage } from './QuadranteOnePage'
import { QuadranteTitlePage } from './QuadranteTitlePage'

interface QuadranteCirculoPageProps {
  title: string
  integrantes: EncontristaQuadrante[]
  circleColor: string
  cartazUrl?: string
  isPb?: boolean
}

export function QuadranteCirculoPage({
  title,
  integrantes,
  circleColor,
  cartazUrl,
  isPb = false,
}: QuadranteCirculoPageProps) {
  const titleColor = isPb
    ? 'text-transparent font-outline-2'
    : getCirculoTitleColor(circleColor)

  return (
    <QuadranteOnePage>
      <QuadranteTitlePage title={title} titleColor={titleColor}>
        {/* Grid de integrantes */}
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-8">
          {integrantes.map((member, index) => (
            <div
              key={index}
              className="my-0 flex items-center justify-start px-8 py-0 text-base"
            >
              <div
                className={cn(
                  'flex w-full flex-col text-3xl',
                  member.coord && 'font-bold',
                )}
              >
                <span>{member.nome}</span>
                <span>Apelido: {member.apelido}</span>
                <span>Nascimento: {member.dataNasc}</span>
                <span>Telefone: {member.celular}</span>
                <span>Bairro: {member.bairro}</span>
                <span>Instagram: {member.instagram}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cartaz ocupa o restante */}
        {cartazUrl && (
          <div className="col-span-2 row-span-2 flex items-center justify-center p-4">
            <Image
              src={cartazUrl}
              width={1200}
              height={1200}
              alt={`Cartaz ${title}`}
              className="max-h-[30rem] object-contain"
            />
          </div>
        )}
      </QuadranteTitlePage>
    </QuadranteOnePage>
  )
}
