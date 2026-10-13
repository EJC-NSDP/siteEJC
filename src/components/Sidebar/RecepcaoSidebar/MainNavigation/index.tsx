import { Baby, Speech } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '../../NavItem'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <Link href="/admin/recepcao/palestrantes">
        <NavItem
          title="Palestrantes"
          icon={Speech}
          active={path === '/admin/recepcao/palestrantes'}
        />
      </Link>
      <Link href="/admin/recepcao/encontristas">
        <NavItem
          title="Encontristas"
          icon={Baby}
          active={path === '/admin/recepcao/encontristas'}
        />
      </Link>
    </nav>
  )
}
