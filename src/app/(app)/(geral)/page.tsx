import { Capa } from './(home)/Capa'
import { Depoimentos } from './(home)/Depoimentos'
import { Eventos } from './(home)/Eventos'
import { Mapa } from './(home)/Mapa'
import { Missa } from './(home)/Missa'
import { QuerParticipar } from './(home)/QuerParticipar'

import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Capa />
      <Eventos />
      <Depoimentos />
      <Mapa />
      <Missa />
      <QuerParticipar />
      <Footer />
    </div>
  )
}
