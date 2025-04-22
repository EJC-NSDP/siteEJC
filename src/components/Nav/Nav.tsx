import type { ReactNode } from 'react'
import { Card, CardContent } from '../ui/card'

interface NavigationProps {
  children: ReactNode
}

export function Nav({ children }: NavigationProps) {
  return (
    <div className="hidden h-80 w-1/4 lg:col-span-3 lg:grid">
      <Card className="fixed h-auto w-[19%] px-1 py-8 text-zinc-700">
        <CardContent className="w-full py-0">
          <nav className="flex flex-col">{children}</nav>
        </CardContent>
      </Card>
    </div>
  )
}
