import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { SecretariaSidebar } from '@/components/Sidebar/SecretariaSidebar'
import { authOptions } from '@/lib/auth/auth-options'

export const metadata: Metadata = {
  title: 'Quadrante | EJC NSDP',
  description: '',
}

export default async function SecretariaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  const isAuthorized =
    session &&
    (session.user.role === 'SECRETARIA' ||
      session.user.role === 'DIRIGENTE' ||
      session.user.role === 'ADMIN')

  if (!isAuthorized) {
    redirect('/admin/profile')
  }

  return (
    <div className="scroll-smooth bg-zinc-50 lg:grid lg:grid-cols-12">
      <div className="bg-blue-600 lg:col-span-2">
        <SecretariaSidebar />
      </div>
      <main className="bg-zinc-100 pt-12 pr-8 pb-8 pl-4 lg:col-span-full lg:col-start-3">
        {children}
      </main>
    </div>
  )
}
