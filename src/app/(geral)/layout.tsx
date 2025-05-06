import { Header } from '@/components/Header'
import { redirect } from 'next/navigation'

export default function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  redirect('/mainetence')

  return (
    // <div className="from-gradient-primary to-gradient-secondary h-auto bg-gradient-to-r">
    <div className="z-50 h-screen w-auto bg-primary">
      <Header />
      <div className="z-40 h-auto bg-primary">{children}</div>
    </div>
  )
}
