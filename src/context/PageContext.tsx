// PageContext.tsx
'use client'

import { createContext, useContext, useEffect, useRef } from 'react'

interface PageContextType {
  getNextPageNumber: () => number
  resetPageCount: () => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: React.ReactNode }) {
  const pageRef = useRef(1)

  const getNextPageNumber = () => {
    const page = pageRef.current
    pageRef.current += 1
    return page
  }

  const resetPageCount = () => {
    pageRef.current = 1
  }

  useEffect(() => {
    resetPageCount()
  }, [])

  return (
    <PageContext.Provider value={{ getNextPageNumber, resetPageCount }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePageContext() {
  const ctx = useContext(PageContext)
  if (!ctx) throw new Error('usePageContext must be used inside PageProvider')
  return ctx
}
