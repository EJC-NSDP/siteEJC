'use client'

import { usePageContext } from '@/context/PageContext'
import { useEffect, useState } from 'react'

interface QuadranteOnePageProps {
  children: React.ReactNode
}

export function QuadranteOnePage({ children }: QuadranteOnePageProps) {
  const { getNextPageNumber } = usePageContext()
  const [pageNumber, setPageNumber] = useState<number | null>(null)

  useEffect(() => {
    // Só chama uma vez mesmo com Strict Mode
    setPageNumber(getNextPageNumber())
  }, [getNextPageNumber])

  return (
    <div className="flex h-a4 w-sheet flex-col bg-white p-4 pt-8">
      <div className="flex flex-grow flex-col gap-4">{children}</div>
      <div className="mt-auto text-center text-lg text-gray-500">
        {pageNumber}
      </div>
    </div>
  )
}
