import { authOptions } from '@/lib/auth/auth-options'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

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
