import type { ElementType } from 'react'

import { cn } from '@/lib/utils'

export interface EncontristaCartaStatusProps {
  label: string
  icon: ElementType
  color: string
}

export function EncontristaCartaStatus({
  label,
  icon: Icon,
  color,
}: EncontristaCartaStatusProps) {
  return (
    <div className={cn('flex items-center gap-2', color)}>
      <Icon className="h-4 w-4" />
      <span className="text-nowrap">{label}</span>
    </div>
  )
}
