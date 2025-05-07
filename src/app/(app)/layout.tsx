'use server'

import { Sheet } from '@/components/ui/sheet'
import { ReactNode } from 'react'

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
