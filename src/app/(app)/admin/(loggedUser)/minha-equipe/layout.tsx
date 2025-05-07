import { authOptions } from '@/lib/auth/auth-options'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

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
    (session.user.role === 'SECRETARIA' ||
      session.user.role === 'DIRIGENTE' ||
      session.user.role === 'COORDENADOR' ||
      session.user.role === 'EXTERNA' ||
      session.user.role === 'ADMIN')

  if (!isAuthorized) {
    redirect('/admin/profile')
  }

  return <>{children}</>
}
