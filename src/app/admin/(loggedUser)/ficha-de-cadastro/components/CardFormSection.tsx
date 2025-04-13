import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardFormSectionProps {
  children: ReactNode
  className?: string
}

export function CardFormSection({ children, className }: CardFormSectionProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 px-0 py-5 text-lg lg:gap-7 lg:py-7',
        className,
      )}
    >
      {children}
    </div>
  )
}
