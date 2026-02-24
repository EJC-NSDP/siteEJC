import {
  Cake,
  Circle,
  DoorClosedLocked,
  DoorOpen,
  History,
  Puzzle,
  SquareChartGantt,
  SquareUserRound,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '../../NavItem'
import { NavItemGroup } from '../../NavItemGroup'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <Link href="/admin/dirigente">
        <NavItem
          title="Encontreiros"
          icon={SquareUserRound}
          active={path === '/admin/dirigente'}
        />
      </Link>
      <NavItemGroup title="Histórico" value="historico" icon={History}>
        <Link href="/admin/dirigente/historico/circulo">
          <NavItem
            title="Círculos"
            icon={Circle}
            active={path === '/admin/dirigente/historico/circulo'}
          />
        </Link>

        {/* <Link href="/admin/dirigente/historico/encontroes">
          <NavItem
            title="Encontrões"
            icon={CalendarHeart}
            active={path === '/admin/dirigente/historico/encontroes'}
          />
        </Link> */}
      </NavItemGroup>

      <NavItemGroup
        title="Gerenciar Encontro"
        value="gerenciar-encontro"
        icon={SquareChartGantt}
      >
        <Link href="/admin/dirigente/gerenciar-encontro/criar-encontro">
          <NavItem
            title="Criar Encontro"
            icon={DoorOpen}
            active={
              path === '/admin/dirigente/gerenciar-encontro/criar-encontro'
            }
          />
        </Link>

        <Link href="/admin/dirigente/gerenciar-encontro/montagem">
          <NavItem
            title="Montagem"
            icon={Puzzle}
            active={path === '/admin/dirigente/gerenciar-encontro/montagem'}
          />
        </Link>

        <Link href="/admin/dirigente/gerenciar-encontro/equipes">
          <NavItem
            title="Equipes"
            icon={Users}
            active={path === '/admin/dirigente/gerenciar-encontro/equipes'}
          />
        </Link>

        <Link href="/admin/dirigente/gerenciar-encontro/fechar-encontro">
          <NavItem
            title="Fechar Encontro"
            icon={DoorClosedLocked}
            active={
              path === '/admin/dirigente/gerenciar-encontro/fechar-encontro'
            }
          />
        </Link>
      </NavItemGroup>

      <Link href="/admin/dirigente/aniversariantes">
        <NavItem
          title="Aniversariantes"
          icon={Cake}
          active={path === '/admin/dirigente/aniversariantes'}
        />
      </Link>
    </nav>
  )
}
