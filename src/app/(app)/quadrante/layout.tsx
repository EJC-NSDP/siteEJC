import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'

import { authOptions } from '@/lib/auth/auth-options'

interface AdminLayoutProps {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Quadrante | EJC NSDP',
  description: '',
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <>{children}</>
}
