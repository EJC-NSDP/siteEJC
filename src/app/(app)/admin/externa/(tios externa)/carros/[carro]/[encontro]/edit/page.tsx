import type { CarFormData } from '@/@types/carro'
import type { GetCarroProps } from '@/app/api/carro/[carro]/[encontro]/update/get-carro'
import type { EncontroData } from '@/app/api/encontro/[idEncontro]/get-encontro'
import { getCurrentEncontro } from '@/utils/fetch-this-encontro'
import { CarroForm } from '../../../(form)/(pageComponents)/CarroForm'

async function getCarro({ carro, encontro }: GetCarroProps) {
  const carroFound = await fetch(
    `${process.env.NEXTAUTH_URL}/api/carro/${carro}/${encontro}/update`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return carroFound
}

export default async function EditCarro(props: {
  params: Promise<GetCarroProps>
}) {
  const params = await props.params
  const currentEncontro: EncontroData = await getCurrentEncontro()

  const carro: CarFormData = await getCarro(params)

  const isFromThisEncontro = currentEncontro
    ? Number(params.encontro) === currentEncontro.numeroEncontro
    : false

  return <CarroForm data={carro} disabled={!isFromThisEncontro} />
}
