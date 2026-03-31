import { Circle, Theater } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '../../NavItem'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <Link href="/admin/apresentacao">
        <NavItem
          title="Divulgação dos temas"
          icon={Theater}
          active={path === '/admin/apresentacao'}
        />
      </Link>
      <Link href="/admin/apresentacao/circulos">
        <NavItem
          title="Ordenação dos círculos"
          icon={Circle}
          active={path === '/admin/apresentacao/circulos'}
        />
      </Link>
    </nav>
  )
}
