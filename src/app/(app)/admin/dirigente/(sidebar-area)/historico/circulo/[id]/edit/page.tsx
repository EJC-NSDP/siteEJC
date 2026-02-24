import type { CirculoFormData } from '@/@types/circulo'

import { CirculoForm } from './(form)/CirculoForm'

async function getCirculo(id: string) {
  const circulo = await fetch(`${process.env.NEXTAUTH_URL}/api/circulo/${id}`, {
    cache: 'no-store',
  }).then(async (res) => await res.json())

  return circulo
}

export default async function EditEncontreiro(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const circulo: CirculoFormData = await getCirculo(params.id)

  return <CirculoForm data={circulo} />
}
