import type { ElementType } from 'react'

export interface InfoMissaProps {
  text: string
  icon: ElementType
}

export function InfoMissa({ text, icon: Icon }: InfoMissaProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-secondary h-8 w-8" />
      <span className="text-sm font-bold text-violet-200">{text}</span>
    </div>
  )
}
