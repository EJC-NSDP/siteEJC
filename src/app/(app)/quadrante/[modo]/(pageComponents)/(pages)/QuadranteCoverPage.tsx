'use client'

import Image from 'next/image'
import { useEffect } from 'react'

import { usePageContext } from '@/context/PageContext'

interface QuadranteCoverPageProps {
  imageUrl: string
  alt: string
}

export function QuadranteCoverPage({ imageUrl, alt }: QuadranteCoverPageProps) {
  const { getNextPageNumber } = usePageContext()

  useEffect(() => {
    getNextPageNumber()
    // Apenas conta a página, sem renderizar nada
  }, [getNextPageNumber])

  return (
    <div className="h-a4 w-a4 relative flex flex-wrap items-start justify-center bg-white px-2 py-4 print:mx-auto">
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={1748}
          height={2480}
          alt={alt}
          className="h-full w-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">
            {alt} - Nenhuma imagem em nosso banco
          </span>
        </div>
      )}
    </div>
  )
}
