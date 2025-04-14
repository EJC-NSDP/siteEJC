import { Building2, Clipboard, ClipboardCheck, Save, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { EditNavItem } from './edit-nav-item'

export function EditNavigation() {
  const path = usePathname()

  return (
    <nav className="flex flex-col">
      <Link href="#password-section">
        <EditNavItem
          title="Sua senha"
          icon={User}
          active={path === '#password-section'}
        />
      </Link>
      <Link href="#personal-section">
        <EditNavItem
          title="Sobre você"
          icon={User}
          active={path === '#personal-section'}
        />
      </Link>
      <Link href="#address-section">
        <EditNavItem
          title="Seu endereço"
          icon={Building2}
          active={path === '#address-section'}
        />
      </Link>
      <Link href="#ejc-section">
        <EditNavItem
          title="Sobre o EJC"
          icon={Clipboard}
          active={path === '#ejc-section'}
        />
      </Link>
      <Link href="#prox-ejc-section">
        <EditNavItem
          title="Sobre o próximo EJC"
          icon={ClipboardCheck}
          active={path === '#prox-ejc-section'}
        />
      </Link>
      <Link href="#save-section">
        <EditNavItem
          title="Salvar"
          icon={Save}
          active={path === '#save-section'}
        />
      </Link>
    </nav>
  )
}
