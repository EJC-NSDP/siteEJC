import { Check, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

export interface CardAcaoProps {
  title: string
  description: string
  status: boolean
  warning?: string
  children: ReactNode
}

export function CardAcao({
  title,
  description,
  children,
  status,
  warning,
}: CardAcaoProps) {
  return (
    <Card className="p-8">
      <CardTitle className="flex items-center gap-4 text-lg">
        {status ? (
          <div className="rounded-full border border-emerald-500 bg-emerald-500/10 p-1">
            <Check className="size-4 text-emerald-500" />
          </div>
        ) : (
          <div className="border-tertiary rounded-full border p-1">
            <Check className="size-4 opacity-0" />
          </div>
        )}
        <span>{title}</span>
      </CardTitle>
      <CardContent className="flex flex-col gap-4 px-0 py-8 text-left text-zinc-800">
        <p>{description}</p>
        {warning && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm">{warning}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="w-full justify-end p-0">{children}</CardFooter>
    </Card>
  )
}
