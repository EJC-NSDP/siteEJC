import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'

import { Header } from '@/app/(app)/admin/(loggedUser)/profile/(sectionComponents)/Header'
import { getDAAberto } from '@/app/api/da/get-da-aberto'
import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'

export default async function DALayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  if (
    !hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP', 'ENCONTREIRO'])
  ) {
    redirect('/admin/profile')
  }

  const aberto = await getDAAberto()
  if (!aberto) redirect('/admin/profile')

  return (
    <div className="bg-primary z-50 min-h-screen w-auto">
      <Header />
      <main className="bg-primary z-40 flex h-auto items-center justify-center p-4 lg:px-40">
        {children}
      </main>
    </div>
  )
}
