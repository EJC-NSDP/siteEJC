import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

export interface CardAcaoProps {
  title: string
  description: string
  status: boolean
  children: ReactNode
}

export function CardAcao({
  title,
  description,
  children,
  status,
}: CardAcaoProps) {
  return (
    <Card className="p-8">
      <CardTitle className="flex items-center gap-4 text-lg">
        {status ? (
          <div className="rounded-full border border-emerald-500 bg-emerald-500/10 p-1">
            <Check className="size-4 text-emerald-500" />
          </div>
        ) : (
          <div className="rounded-full border border-tertiary p-1">
            <Check className="size-4 opacity-0" />
          </div>
        )}
        <span>{title}</span>
      </CardTitle>
      <CardContent className="px-0 py-8 text-left text-zinc-800">
        {description}
      </CardContent>
      <CardFooter className="w-full justify-end p-0">{children}</CardFooter>
    </Card>
  )
}
