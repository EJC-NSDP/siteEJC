import { Puzzle, SquareUserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from './NavItem'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      <Link href="/admin/dirigente">
        <NavItem
          title="Encontreiro"
          icon={SquareUserRound}
          active={path === '/admin/dirigente'}
        />
      </Link>
      <Link href="/admin/dirigente/montagem">
        <NavItem
          title="Montagem"
          icon={Puzzle}
          active={path === '/admin/dirigente/montagem'}
        />
      </Link>
    </nav>
  )
}
