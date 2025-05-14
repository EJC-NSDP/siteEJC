import { Card, CardContent, CardTitle } from '@/components/ui/card'

export interface CardCapasProps {
  title: string
  children: React.ReactNode
}

export function CardCapas({ title, children }: CardCapasProps) {
  return (
    <Card className="flex items-center gap-8 p-4">
      <CardTitle className="w-44 p-0 text-lg font-semibold text-tertiary">
        {title}
      </CardTitle>
      <CardContent className="w-full p-0 text-base font-normal text-zinc-500">
        {children}
      </CardContent>
    </Card>
  )
}
