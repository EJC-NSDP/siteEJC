import type { Metadata } from 'next'

import { DirigenteSidebar } from '@/components/DirigenteSidebar'

export const metadata: Metadata = {
  title: 'Dirigente | EJC NSDP',
  description: '',
}

export default async function DirigenteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="scroll-smooth bg-zinc-50 lg:grid lg:grid-cols-12">
      <div className="bg-blue-600 lg:col-span-2">
        <DirigenteSidebar />
      </div>
      <main className="bg-zinc-100 pt-12 pr-8 pb-8 pl-4 lg:col-span-full lg:col-start-3">
        {children}
      </main>
    </div>
  )
}
