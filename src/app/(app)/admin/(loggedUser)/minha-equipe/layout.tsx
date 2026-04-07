import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'

export const metadata: Metadata = {
  title: 'Equipe | EJC NSDP',
  description: '',
}

export default async function EquipeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'COORDENADOR'])) {
    redirect('/admin/profile')
  }

  return <>{children}</>
}
