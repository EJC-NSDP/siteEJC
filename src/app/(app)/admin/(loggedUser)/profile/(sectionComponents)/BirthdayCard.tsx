'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Cake } from 'lucide-react'

export function BirthdayCard() {
  return (
    <Card className={cn('h-24 w-full border p-4 px-2 lg:w-1/4 lg:p-8')}>
      <CardContent
        className="flex items-center justify-center gap-2"
        title="Venha comemorar seu aniversário com a gente na missa das 18h"
      >
        <Cake className="size-9" />
        <span className="text-xl lg:text-2xl">Parabéns!</span>
      </CardContent>
    </Card>
  )
}
