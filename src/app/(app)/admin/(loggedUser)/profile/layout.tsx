import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Perfil | EJC NSDP',
  description: '',
}

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
