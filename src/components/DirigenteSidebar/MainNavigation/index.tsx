import { Circle, Puzzle, SquareUserRound } from 'lucide-react'
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
      {/* <Link href="/admin/dirigente/info-encontreiro">
        <NavItem
          title="Informações Encontreiro"
          icon={UserSearch}
          active={path === '/admin/dirigente/info-encontreiro'}
        />
      </Link> */}
    </nav>
  )
}
