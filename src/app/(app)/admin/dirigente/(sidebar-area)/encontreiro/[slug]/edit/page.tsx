import { EncontreiroForm } from '../../(form)/(pageComponents)/EncontreiroForm'

import type { EncontreiroFormData } from '@/@types/encontreiro'

async function getEncontreiro(slug: string) {
  const encontreiro = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontreiro/update/${slug}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return encontreiro
}

export default async function EditEncontreiro(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const encontreiro: EncontreiroFormData = await getEncontreiro(params.slug)

  return <EncontreiroForm data={encontreiro} />
}
