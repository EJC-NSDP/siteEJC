import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface CardQuadranteProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  children: React.ReactNode
  cartaz?: boolean
}

export function CardQuadrante({
  title,
  children,
  cartaz = false,
  ...props
}: CardQuadranteProps) {
  const [open, setOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const handleClick = () => setOpen((prev) => !prev)
  const handleMouseEnter = () => !isTouch && setOpen(true)
  const handleMouseLeave = () => !isTouch && setOpen(false)

  const tip = cartaz
    ? 'Os cartazes devem ser colocadas como arquivos jpg 1:1 (quadrado)'
    : 'As capas e cartas devem ser colocadas como arquivos jpg no tamanho de uma A4'

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
      <Card className="text-tertiary col-span-2 space-y-4 p-4 lg:col-span-1">
        <CardTitle>
          <div className="flex items-start gap-2">
            <span className="text-tertiary">{title}</span>
            <TooltipTrigger
              type="button"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            >
              <CircleHelp className="size-4 cursor-pointer" />
            </TooltipTrigger>
          </div>
        </CardTitle>
        <CardContent {...props}>{children}</CardContent>
      </Card>
      <TooltipContent className="w-40 text-center text-balance lg:w-48">
        {tip}
      </TooltipContent>
    </Tooltip>
  )
}
