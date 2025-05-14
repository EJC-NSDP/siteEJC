import { QuadranteOnePage } from './QuadranteOnePage'

interface QuadranteTwoPageProps {
  children: React.ReactNode
}

export function QuadranteTwoPage({ children }: QuadranteTwoPageProps) {
  return (
    <QuadranteOnePage>
      <div className="flex flex-col gap-12">{children}</div>
    </QuadranteOnePage>
  )
}
