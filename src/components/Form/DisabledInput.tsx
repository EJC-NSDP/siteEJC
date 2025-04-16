import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { FormLabel } from '../ui/form'

export interface DisabledInputProps {
  label?: string
  value: string
  children?: ReactNode
}

export function DisabledInput({ label, value, children }: DisabledInputProps) {
  return (
    <label className="flex flex-col gap-2">
      {label && <FormLabel className="font-medium">{label}</FormLabel>}
      <div
        className={cn(
          'flex w-full cursor-not-allowed items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm opacity-90 shadow-sm placeholder:text-zinc-400',
        )}
      >
        <input
          className={cn(
            'flex-1 border-0 bg-transparent p-0 text-zinc-700 placeholder-zinc-400 outline-none',
            'dark:text-zinc-100 dark:placeholder-zinc-400',
            'read-only:cursor-not-allowed',
            'disabled:cursor-not-allowed',
          )}
          disabled
          value={value}
        />
        {children && children}
      </div>
    </label>
  )
}
