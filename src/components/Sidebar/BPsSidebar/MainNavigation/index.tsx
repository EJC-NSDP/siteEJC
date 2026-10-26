import { Beef, Bus, CalendarHeart, HeartHandshake, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '../../NavItem'
import { NavItemGroup } from '../../NavItemGroup'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <NavItemGroup
        title="Dia da Amizade"
        value="dia-amizade"
        icon={CalendarHeart}
      >
        <Link href="/admin/bp/da">
          <NavItem
            title="Gerenciar DA"
            icon={CalendarHeart}
            active={path === '/admin/bp/da'}
          />
        </Link>
        <Link href="/admin/bp/da/inscritos">
          <NavItem
            title="Inscritos"
            icon={Users}
            active={path === '/admin/bp/da/inscritos'}
          />
        </Link>
        <Link href="/admin/bp/da/itens">
          <NavItem
            title="O que levar"
            icon={Beef}
            active={path === '/admin/bp/da/itens'}
          />
        </Link>
        <Link href="/admin/bp/da/transporte">
          <NavItem
            title="Transporte"
            icon={Bus}
            active={path === '/admin/bp/da/transporte'}
          />
        </Link>
      </NavItemGroup>
      <Link href="/admin/bp">
        <NavItem
          title="Pastorais"
          icon={HeartHandshake}
          active={path === '/admin/bp'}
        />
      </Link>
    </nav>
  )
}
