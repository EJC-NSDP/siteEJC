import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DAInscricaoSkeleton() {
  return (
    <div className="mx-auto max-w-xl space-y-6 pt-8">
      {/* Mensagem */}
      <Card>
        <CardContent className="space-y-2 py-5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>

      {/* Label */}
      <Skeleton className="h-4 w-40" />

      {/* Itens */}
      <div className="grid gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border bg-white px-4 py-3"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Botão */}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}
