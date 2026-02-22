import { EditEncontristaForm } from './EditEncontristaForm'

import type { EncontristaData } from '@/app/api/encontrista/[id]/get-encontrista'

async function getEncontrista(slug: string) {
  const id = await fetch(
    `${process.env.NEXTAUTH_URL}/api/pessoa/id-from-slug/${slug}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  const encontrista = await fetch(
    `${process.env.NEXTAUTH_URL}/api/encontrista/${id}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return encontrista
}

export default async function EditEncontrista(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const encontrista: EncontristaData = await getEncontrista(params.slug)

  return <EditEncontristaForm data={encontrista} />
}
