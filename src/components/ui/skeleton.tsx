import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-zinc-500 dark:bg-zinc-600',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
