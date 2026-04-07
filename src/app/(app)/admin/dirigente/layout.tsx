import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'

export const metadata: Metadata = {
  title: 'Dirigente | EJC NSDP',
  description: '',
}

export default async function DirigenteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE'])) {
    redirect('/admin/profile')
  }

  return <>{children}</>
}
