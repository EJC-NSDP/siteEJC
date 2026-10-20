'use client'

import { ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '../../NavItem'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <Link href="/admin/coordenador/avaliacao">
        <NavItem
          title="Avaliação"
          icon={ClipboardList}
          active={path.startsWith('/admin/coordenador/avaliacao')}
        />
      </Link>
    </nav>
  )
}
