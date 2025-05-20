import { usePageContext } from '@/context/PageContext'
import { useRef } from 'react'

export function useNextPageNumber() {
  const { getNextPageNumber } = usePageContext()
  const pageRef = useRef<number | null>(null)

  if (pageRef.current === null) {
    pageRef.current = getNextPageNumber()
  }

  return getNextPageNumber()
}
