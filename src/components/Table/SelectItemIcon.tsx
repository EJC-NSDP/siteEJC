import type { ElementType } from 'react'

import { SelectItem } from '../ui/select'

import type { valueStatus } from '@/@types/enums'
import type { StatusEncontreiro } from '@/generated'
import { cn } from '@/lib/utils'

export interface SelectItemIconProps {
  value: valueStatus | StatusEncontreiro
  label: string
  icon: ElementType
  color: string
}

export function SelectItemIcon({
  value,
  label,
  icon: Icon,
  color,
}: SelectItemIconProps) {
  return (
    <SelectItem value={value} className="hover:bg-violet-100">
      <div className="flex w-full items-center gap-2 pr-2">
        <Icon className={cn('h-4 w-4', color)} />
        <span className="text-tertiary text-nowrap">{label}</span>
      </div>
    </SelectItem>
  )
}
