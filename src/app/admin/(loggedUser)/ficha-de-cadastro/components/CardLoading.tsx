import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CardLoading() {
  return (
    <Card className="w-full items-center justify-center px-3 pt-8 text-center text-zinc-700">
      <CardContent className="w-full">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold lg:text-nowrap">
            Ficha de Cadastro
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-nowrap font-normal lg:text-nowrap">
            Carregando sua ficha de cadastro
          </span>
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}
