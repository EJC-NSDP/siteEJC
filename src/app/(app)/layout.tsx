'use server'

import { ReactNode } from 'react'

import { Sheet } from '@/components/ui/sheet'

interface SheetLayoutProps {
  children: ReactNode
  sheet: ReactNode
}

export default async function SheetLayout({
  children,
  sheet,
}: SheetLayoutProps) {
  return (
    <div>
      <Sheet>{children}</Sheet>
      {sheet}
    </div>
  )
}
