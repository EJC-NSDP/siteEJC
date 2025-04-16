import { ExternaSidebar } from '@/components/ExternaSidebar'
import { authOptions } from '@/lib/auth/auth-options'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Externa | EJC NSDP',
  description: '',
}

export default async function ExternaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  const isAuthorized =
    session &&
    (session.user.role === 'EXTERNA' ||
      session.user.role === 'ADMIN' ||
      session.user.role === 'DIRIGENTE')

  if (!isAuthorized) {
    redirect('/admin/profile')
  }

  return (
    <div className="scroll-smooth bg-zinc-50 lg:grid lg:grid-cols-12">
      <div className="bg-blue-600 lg:col-span-2">
        <ExternaSidebar />
      </div>
      <main className="bg-zinc-100 pb-8 pl-4 pr-8 pt-12 lg:col-span-full lg:col-start-3">
        {children}
      </main>
    </div>
  )
}
