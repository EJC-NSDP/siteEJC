'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Cake } from 'lucide-react'

interface BirthdayCardProps {
  isSelf?: boolean
}

export function BirthdayCard({ isSelf = false }: BirthdayCardProps) {
  const title = isSelf
    ? 'Comemore seu aniversário conosco na missa das 18h!'
    : 'Vamos celebrar e rezar juntos na missa das 18h!'

  return (
    <Card
      className={cn('h-24 w-full border p-4 px-2 lg:w-1/4 lg:p-8')}
      title={title}
    >
      <CardContent className="flex items-center justify-center gap-2">
        <Cake className="size-9" />
        <span className="text-xl lg:text-2xl">Parabéns!</span>
      </CardContent>
    </Card>
  )
}
