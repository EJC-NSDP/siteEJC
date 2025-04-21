import { BookUser, Building2, Save, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { EditEncontreiroNavItem } from './edit-nav-item'

export function EditEncontreiroNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col">
      <Link href="#personal-section">
        <EditEncontreiroNavItem
          title="Dados Pessoais"
          icon={User}
          active={path === '#personal-section'}
        />
      </Link>
      <Link href="#address-section">
        <EditEncontreiroNavItem
          title="Endereço"
          icon={Building2}
          active={path === '#address-section'}
        />
      </Link>
      <Link href="#ejc-section">
        <EditEncontreiroNavItem
          title="EJC"
          icon={BookUser}
          active={path === '#ejc-section'}
        />
      </Link>
      <Link href="#save-section">
        <EditEncontreiroNavItem
          title="Salvar"
          icon={Save}
          active={path === '#save-section'}
        />
      </Link>
    </nav>
  )
}
