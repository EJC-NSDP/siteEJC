import { useRef } from 'react'

import { usePageContext } from '@/context/PageContext'

export function useNextPageNumber() {
  const { getNextPageNumber } = usePageContext()
  const pageRef = useRef<number | null>(null)

  if (pageRef.current === null) {
    pageRef.current = getNextPageNumber()
  }

  return getNextPageNumber()
}
