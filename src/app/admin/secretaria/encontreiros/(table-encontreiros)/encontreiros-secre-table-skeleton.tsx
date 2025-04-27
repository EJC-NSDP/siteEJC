import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function EncontreiroSecreTableSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => {
    return (
      <TableRow key={i} className="bg-white">
        <TableCell>
          <Skeleton className="h-4 w-6" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-56" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-14" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-14" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-14" />
        </TableCell>
        <TableCell className="flex justify-center">
          <Skeleton className="h-4 w-11" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-8" />
        </TableCell>
      </TableRow>
    )
  })
}
