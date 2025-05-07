import {
  BookUser,
  Car,
  HeartHandshake,
  Shirt,
  Speech,
  SquareUser,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem } from './NavItem'

export function MainNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-4 space-y-0.5">
      {/* <Link href="/admin/secretaria">
        <NavItem
          title="Encontristas"
          icon={Baby}
          active={path === '/admin/secretaria'}
        />
      </Link> */}
      <Link href="/admin/secretaria/encontreiros">
        <NavItem
          title="Encontreiros"
          icon={SquareUser}
          active={path === '/admin/secretaria/encontreiros'}
        />
      </Link>
      <Link href="/admin/secretaria/tios-externa">
        <NavItem
          title="Tios de externa"
          icon={Car}
          active={path === '/admin/secretaria/tios-externa'}
        />
      </Link>
      <Link href="/admin/secretaria/equipes">
        <NavItem
          title="Equipes"
          icon={Users}
          active={path === '/admin/secretaria/equipes'}
        />
      </Link>
      <Link href="/admin/secretaria/palestrantes">
        <NavItem
          title="Palestrantes"
          icon={Speech}
          active={path === '/admin/secretaria/palestrantes'}
        />
      </Link>
      <Link href="/admin/secretaria/diris-bps">
        <NavItem
          title="Diris e BPs"
          icon={Shirt}
          active={path === '/admin/secretaria/diris-bps'}
        />
      </Link>
      <Link href="/admin/secretaria/pastorais">
        <NavItem
          title="Pastorais"
          icon={HeartHandshake}
          active={path === '/admin/secretaria/pastorais'}
        />
      </Link>
      <Link href="/admin/secretaria/quadrante">
        <NavItem
          title="Gerar Quadrante"
          icon={BookUser}
          active={path === '/admin/secretaria/quadrante'}
        />
      </Link>
    </nav>
  )
}
