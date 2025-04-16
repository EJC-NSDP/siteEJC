import { BookUser, Building2, KeyRound, Puzzle, Save, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CadastroNavItem } from './cadastro-nav-item'

interface CadastroNavigationProps {
  changePassword: boolean
}

export function CadastroNavigation({
  changePassword,
}: CadastroNavigationProps) {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-2 px-4">
      {changePassword && (
        <Link href="#password-section">
          <CadastroNavItem
            title="Sua senha"
            icon={KeyRound}
            active={path === '#password-section'}
          />
        </Link>
      )}
      <Link href="#personal-section">
        <CadastroNavItem
          title="Sobre você"
          icon={User}
          active={path === '#personal-section'}
        />
      </Link>
      <Link href="#address-section">
        <CadastroNavItem
          title="Seu endereço"
          icon={Building2}
          active={path === '#address-section'}
        />
      </Link>
      <Link href="#ejc-section">
        <CadastroNavItem
          title="Sobre o EJC"
          icon={BookUser}
          active={path === '#ejc-section'}
        />
      </Link>
      <Link href="#prox-ejc-section">
        <CadastroNavItem
          title="Sobre o próximo EJC"
          icon={Puzzle}
          active={path === '#prox-ejc-section'}
        />
      </Link>
      <Link href="#save-section">
        <CadastroNavItem
          title="Salvar"
          icon={Save}
          active={path === '#save-section'}
        />
      </Link>
    </nav>
  )
}
