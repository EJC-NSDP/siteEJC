import Image, { type StaticImageData } from 'next/image'

import { Card } from '@/components/ui/card'

export interface CardEventoContentProps {
  title: string
  content: string
}

export interface CardCarouselContentProps {
  imageSrc: StaticImageData
  aditionalInfo?: CardEventoContentProps
  type?: 'evento' | 'mapa'
}

export function CardCarouselContent({
  imageSrc,
  aditionalInfo,
  type = 'evento',
}: CardCarouselContentProps) {
  return (
    <Card className="flex items-center justify-center bg-zinc-50 p-0 shadow-xl overflow-hidden">
      {type === 'evento' ? (
        <div className="flex h-98 flex-col items-center gap-2 p-4 lg:h-auto lg:flex-row lg:gap-8 lg:p-8">
          <div className="w-auto h-64 lg:h-80 relative shrink-0">
            <Image
              src={imageSrc.src}
              width={imageSrc.width}
              height={imageSrc.height}
              alt={`Imagem do evento ${aditionalInfo?.title}`}
              className="object-cover rounded-lg"
            />
          </div>
          {aditionalInfo && (
            <div className="text-tertiary flex flex-col gap-2 lg:gap-9">
              <h2 className="text-sm font-bold lg:text-2xl">
                {aditionalInfo.title}
              </h2>
              <span className="text-xs lg:text-base">
                {aditionalInfo.content}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-xl p-0 lg:p-4">
          <Image src={imageSrc} className="h-auto w-full" alt="Imagem card" />
        </div>
      )}
    </Card>
  )
}
