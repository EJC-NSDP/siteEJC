import { Theater } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '../../NavItem'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <Link href="/admin/bps">
        <NavItem
          title="Divulgação dos temas"
          icon={Theater}
          active={path === '/admin/bps'}
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
