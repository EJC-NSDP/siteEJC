import type { EncontristaQuadrante } from '@/@types/quadrante'
import { cn } from '@/lib/utils'
import { getCirculoTitleColor } from '@/utils/fetch-color'
import Image from 'next/image'

import { Anton } from 'next/font/google'
import { QuadranteOnePage } from './QuadranteOnePage'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
})

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
    ? 'text-white font-outline-2'
    : getCirculoTitleColor(circleColor)

  return (
    <QuadranteOnePage>
      <div className={anton.className}>
        <h1
          className={cn(
            titleColor || 'text-white',
            'w-full text-center text-7xl font-bold tracking-wider',
          )}
        >
          {title}
        </h1>
      </div>

      <div className="mt-0 flex flex-col gap-8">
        {/* Grid de integrantes */}
        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-8">
          {integrantes.map((member, index) => (
            <div
              key={index}
              className="my-0 flex items-center justify-start px-8 py-0 text-base"
            >
              <div
                className={cn(
                  'flex w-full flex-col',
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
              width={800}
              height={800}
              alt={`Cartaz ${title}`}
              className="max-h-96 object-contain"
            />
          </div>
        )}
      </div>
    </QuadranteOnePage>
  )
}
