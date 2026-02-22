'use server'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { ReactNode } from 'react'

import { authOptions } from '@/lib/auth/auth-options'

interface LoginLayoutProps {
  children: ReactNode
}

export default async function LoginLayout({ children }: LoginLayoutProps) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/admin/profile')
  }
  return <>{children}</>
}
