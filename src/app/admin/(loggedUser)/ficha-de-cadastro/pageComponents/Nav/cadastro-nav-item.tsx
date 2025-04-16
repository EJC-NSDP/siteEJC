import { ElementType } from 'react'

export interface NavItemProps {
  title: string
  icon: ElementType
  active: boolean
}

export function CadastroNavItem({ title, icon: Icon, active }: NavItemProps) {
  return (
    <div
      aria-selected={active}
      className="group flex items-center gap-4 rounded-xl p-3 hover:bg-primary/20 aria-selected:bg-primary"
    >
      <Icon className="size-6 text-zinc-800" />
      <span className="text-sm font-medium text-zinc-800">{title}</span>
    </div>
  )
}
