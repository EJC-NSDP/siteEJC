import { authOptions } from '@/lib/auth/auth-options'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Header } from './(sectionComponents)/Header'

export const metadata: Metadata = {
  title: 'Montagem | EJC NSDP',
  description: '',
}

export default async function RestrictedLayout({
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

  return (
    <div className="z-50 h-screen w-auto bg-primary">
      <Header />
      <main className="z-40 flex h-auto items-center justify-center bg-primary">
        {children}
      </main>
    </div>
  )
}
