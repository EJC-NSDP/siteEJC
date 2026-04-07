import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { BPsSidebar } from '@/components/Sidebar/BPsSidebar'
import { authOptions } from '@/lib/auth/auth-options'
import { hasRole } from '@/lib/auth/permissions'

export const metadata: Metadata = {
  title: 'BPs | EJC NSDP',
  description: '',
}

export default async function BPsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  if (!hasRole(session.user.roles, ['ADMIN', 'DIRIGENTE', 'BP'])) {
    redirect('/admin/profile')
  }

  return (
    <div className="scroll-smooth bg-zinc-50 lg:grid lg:grid-cols-12">
      <div className="bg-blue-600 lg:col-span-2">
        <BPsSidebar />
      </div>
      <main className="bg-zinc-100 pt-12 pr-8 pb-8 pl-4 lg:col-span-full lg:col-start-3">
        {children}
      </main>
    </div>
  )
}
