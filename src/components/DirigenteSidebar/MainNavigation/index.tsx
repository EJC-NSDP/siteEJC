import {
  Cake,
  Circle,
  MapPinPlus,
  Puzzle,
  SquareUserRound,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from './NavItem'

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
      <Link href="/admin/dirigente/circulo">
        <NavItem
          title="Círculos"
          icon={Circle}
          active={path === '/admin/dirigente/circulo'}
        />
      </Link>
      <Link href="/admin/dirigente/montagem">
        <NavItem
          title="Montagem"
          icon={Puzzle}
          active={path === '/admin/dirigente/montagem'}
        />
      </Link>
      <Link href="/admin/dirigente/criar-encontrao">
        <NavItem
          title="Criar Encontrão"
          icon={MapPinPlus}
          active={path === '/admin/dirigente/criar-encontrao'}
        />
      </Link>
      <Link href="/admin/dirigente/equipes">
        <NavItem
          title="Equipes"
          icon={Users}
          active={path === '/admin/dirigente/equipes'}
        />
      </Link>
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
