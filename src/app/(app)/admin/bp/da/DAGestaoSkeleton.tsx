import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DAGestaoSkeleton() {
  return (
    <div className="space-y-6">
      {/* Status */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Skeleton className="h-6 w-11 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded" />
            <Skeleton className="h-9 w-48 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Mensagem inicial */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  )
}
