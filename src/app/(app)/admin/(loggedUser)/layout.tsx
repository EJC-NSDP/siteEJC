import type { Metadata } from 'next'

import { Header } from './profile/(sectionComponents)/Header'

export const metadata: Metadata = {
  title: 'EJC NSDP',
  description: '',
}

export default function RestrictedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-primary z-50 h-screen w-auto">
      <Header />
      <main className="bg-primary z-40 flex h-auto items-center justify-center">
        {children}
      </main>
    </div>
  )
}
