import {
  ArrowDownNarrowWide,
  ArrowDownUp,
  ArrowUpWideNarrow,
} from 'lucide-react'
import type { ElementType } from 'react'

import { TableHead } from '../ui/table'

import { cn } from '@/lib/utils'

export interface SortableTableHeadProps {
  label: string
  value: string
  classname?: string
  orderByField: string | null
  orderByDirection: string | null
  handleFn: (value: string) => void
}

export function SortableTableHead({
  label,
  value,
  classname,
  orderByField,
  orderByDirection,
  handleFn,
}: SortableTableHeadProps) {
  const status =
    orderByField === value
      ? orderByDirection === 'asc'
        ? 'asc'
        : 'desc'
      : undefined

  const Icon: ElementType = status
    ? status === 'asc'
      ? ArrowDownNarrowWide
      : ArrowUpWideNarrow
    : ArrowDownUp

  return (
    <TableHead className={cn(classname)}>
      <button id={value} onClick={() => handleFn(value)}>
        <div className="flex items-center justify-between gap-2">
          <span>{label}</span>
          <Icon className="text-tertiary size-3" />
        </div>
      </button>
    </TableHead>
  )
}
