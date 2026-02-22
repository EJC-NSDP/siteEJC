import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'

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

  const isAuthorized =
    session &&
    (session.user.role === 'DIRIGENTE' || session.user.role === 'ADMIN')

  if (!isAuthorized) {
    redirect('/admin/profile')
  }

  return <>{children}</>
}
