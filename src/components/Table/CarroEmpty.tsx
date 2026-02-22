import { Card } from '@/components/ui/card'

export function CarroEmpty() {
  return (
    <div className="col-span-2 p-4">
      <Card className="border-primary/20 bg-primary/5 flex items-center justify-center gap-4 border-dashed p-20 text-zinc-400 shadow-lg">
        <span>Sem carros cadastrados</span>
      </Card>
    </div>
  )
}
