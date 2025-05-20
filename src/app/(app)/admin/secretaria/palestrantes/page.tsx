import type { PalestraEncontro } from '@/app/api/encontro/atual/[ignorar]/palestrantes/get-palestrantes'
import PalestraForm from './(pageComponents)/PalestraForm'

async function getCurrentPalestras() {
  const palestras = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontro/atual/1/palestrantes`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return palestras
}

export default async function SecretariaPalestrantes() {
  const palestras: PalestraEncontro[] = await getCurrentPalestras()

  return (
    <div className="h-full w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-2xl font-bold text-tertiary">Palestrantes</h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os palestrantes deste Encontrão.{' '}
              <strong>
                Caso modifique, lembre-se de salvar ao final da página.
              </strong>
            </span>
          </div>
        </div>

        <PalestraForm palestras={palestras} />
      </div>
    </div>
  )
}
