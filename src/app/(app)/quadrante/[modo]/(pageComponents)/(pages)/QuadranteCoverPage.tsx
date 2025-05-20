'use client'

import { usePageContext } from '@/context/PageContext'
import Image from 'next/image'
import { useEffect } from 'react'

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
    <div className="relative flex h-a4 w-a4 flex-wrap items-start justify-center bg-white px-2 py-4 print:mx-auto">
      <Image
        src={imageUrl}
        width={1748}
        height={2480}
        alt={alt}
        className="h-full w-full"
      />
    </div>
  )
}
