import type { PalestraEncontro } from '@/app/api/encontro/atual/[ignorar]/palestrantes/get-palestrantes'
import type { Palestra } from '@/app/api/domains/palestras/get-palestra'

import { PalestraReadOnly } from './(pageComponents)/PalestraReadOnly'

async function getCurrentPalestras(): Promise<PalestraEncontro[]> {
  const palestras = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontro/atual/1/palestrantes`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return palestras
}

async function getDominiosPalestras(): Promise<Palestra[]> {
  const palestras = await fetch(
    `${process.env.NEXTAUTH_URL}/api/domains/palestras`,
    { cache: 'force-cache' },
  ).then(async (res) => await res.json())

  return palestras
}

export default async function SecretariaPalestrantes() {
  const [palestras, dominios] = await Promise.all([
    getCurrentPalestras(),
    getDominiosPalestras(),
  ])

  return (
    <div className="h-full w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-tertiary text-2xl font-bold">Palestrantes</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista dos palestrantes deste Encontrão. Alterações são feitas pela
              equipe de recepção.
            </span>
          </div>
        </div>

        <PalestraReadOnly palestras={palestras} dominios={dominios} />
      </div>
    </div>
  )
}
