import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ficha de Cadastro | EJC NSDP',
  description: '',
}

export default async function RestrictedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-primary z-50 h-auto p-4 lg:px-40">
      <main className="bg-primary z-40 flex h-auto items-center justify-center">
        {children}
      </main>
    </div>
  )
}
