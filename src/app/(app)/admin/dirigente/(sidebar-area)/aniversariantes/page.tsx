import type { Aniversariantes } from '@/app/api/pessoa/aniversariantes/get-aniversariantes'

async function getAniversariantes() {
  const response: Aniversariantes[] = await fetch(
    `${process.env.NEXTAUTH_URL}/api/pessoa/aniversariantes`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return response
}

export default async function Aniversariantes() {
  const aniversariantes = await getAniversariantes()

  return (
    <div className="w-ful h-full">
      <div className="pb-4">
        <div className="flex items-center justify-between pb-8">
          <div className="">
            <h1 className="text-2xl font-bold text-tertiary">
              Aniversariantes
            </h1>
            <span className="text-base font-normal text-zinc-500">
              Lista de todos os aniversariantes ativos no encontro nessa semana
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:px-4">
        {aniversariantes.map((encontreiro, index) => {
          return (
            <div key={index}>
              <span>{encontreiro.dataNasc}</span> {' - '}
              <span>{encontreiro.nome}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
