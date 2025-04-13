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
    <div className="z-50 h-screen w-auto bg-primary">
      <main className="z-40 flex h-auto items-center justify-center bg-primary">
        {children}
      </main>
    </div>
  )
}
