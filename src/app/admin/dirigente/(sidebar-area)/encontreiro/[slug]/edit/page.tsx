import type { EncontreiroFormData } from '@/@types/encontreiro'
import { EncontreiroForm } from '../../(form)/pageComponents/EncontreiroForm'

async function getEncontreiro(slug: string) {
  const encontreiro = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontreiro/update/${slug}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return encontreiro
}

export default async function EditEncontreiro({
  params,
}: {
  params: { slug: string }
}) {
  const encontreiro: EncontreiroFormData = await getEncontreiro(params.slug)

  return <EncontreiroForm data={encontreiro} />
}
