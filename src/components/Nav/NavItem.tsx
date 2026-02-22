import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ElementType } from 'react'

export interface NavItemProps {
  title: string
  icon: ElementType
  link: string
}

export function NavItem({ title, icon: Icon, link }: NavItemProps) {
  const path = usePathname()

  return (
    <Link href={link}>
      <div
        aria-selected={path === link}
        className="group hover:bg-primary/20 aria-selected:bg-primary flex items-center gap-4 rounded-xl px-6 py-4"
      >
        <Icon className="h-6 w-6 text-zinc-800" />
        <span className="text-sm font-medium text-zinc-800">{title}</span>
      </div>
    </Link>
  )
}
