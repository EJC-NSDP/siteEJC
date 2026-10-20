import type { Metadata } from 'next'

import { Header } from '@/app/(app)/admin/(loggedUser)/profile/(sectionComponents)/Header'

export const metadata: Metadata = {
  title: 'Avaliação | EJC NSDP',
  description: '',
}

export default function AvaliacaoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-primary z-50 min-h-screen w-full">
      <Header />
      <div className="p-4 lg:px-40">
        <main className="z-40 flex items-start justify-center">
          {children}
        </main>
      </div>
    </div>
  )
}
