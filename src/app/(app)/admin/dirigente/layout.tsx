import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'

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

  const isAuthorized =
    session &&
    (session.user.role === 'ADMIN' || session.user.role === 'DIRIGENTE')

  if (!isAuthorized) {
    redirect('/admin/profile')
  }

  return <>{children}</>
}
