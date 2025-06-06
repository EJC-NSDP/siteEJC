import * as React from 'react'

import { cn } from '@/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        aria-invalid={props['aria-invalid']}
        aria-disabled={props.readOnly || props.disabled}
        className={cn(
          'flex min-h-[80px] w-full items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400',
          'aria-invalid:border-red-400',
          'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
          'focus-within:border-amber-300 focus-within:ring-4 focus-within:ring-amber-100',
          'dark:border-zinc-700 dark:bg-zinc-800',
          'dark:focus-within:border-amber-500 dark:focus-within:ring-amber-500/20',
        )}
      >
        <textarea
          aria-invalid={props['aria-invalid']}
          aria-disabled={props.readOnly || props.disabled}
          className={cn(
            'min-h-[80px] flex-1 border-0 bg-transparent p-0 text-zinc-700 placeholder-zinc-400 outline-none',
            'dark:text-zinc-100 dark:placeholder-zinc-400',
            'read-only:cursor-not-allowed',
            'disabled:cursor-not-allowed',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
