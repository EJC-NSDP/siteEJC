'use client'

import { Cake } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface BirthdayCardProps {
  isSelf?: boolean
}

export function BirthdayCard({ isSelf = false }: BirthdayCardProps) {
  const [open, setOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const handleClick = () => setOpen((prev) => !prev)
  const handleMouseEnter = () => !isTouch && setOpen(true)
  const handleMouseLeave = () => !isTouch && setOpen(false)

  const title = isSelf
    ? 'Comemore seu aniversário conosco na missa das 18h!'
    : 'Vamos celebrar e rezar juntos na missa das 18h!'

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
      <TooltipTrigger
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        asChild
      >
        <Card className="flex h-24 w-full items-center justify-center border p-4 px-2 lg:w-1/4 lg:p-8">
          <CardContent className="flex items-center justify-center gap-2 p-0">
            <Cake className="size-9" />
            <span className="text-xl lg:text-2xl">Parabéns!</span>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent className="w-56 text-center">
        <span className="text-zinc-500">{title}</span>
      </TooltipContent>
    </Tooltip>
  )
}
