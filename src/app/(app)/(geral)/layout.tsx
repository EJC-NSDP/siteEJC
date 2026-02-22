import { Header } from '@/components/Header'

export default function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <div className="from-gradient-primary to-gradient-secondary h-auto bg-gradient-to-r">
    <div className="bg-primary z-50 h-screen w-auto">
      <Header />
      <div className="bg-primary z-40 h-auto">{children}</div>
    </div>
  )
}
