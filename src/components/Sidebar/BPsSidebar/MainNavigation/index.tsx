import { HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '../../NavItem'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <Link href="/admin/bp">
        <NavItem
          title="Pastorais"
          icon={HeartHandshake}
          active={path === '/admin/bp'}
        />
      </Link>
      {/* <Link href="/admin/bps/circulos">
        <NavItem
          title="Ordenação dos círculos"
          icon={Circle}
          active={path === '/admin/bps/circulos'}
        />
      </Link> */}
    </nav>
  )
}
