import type { EncontristaSecreData } from '@/app/api/secretaria/encontrista/[slug]/get-encontrista-secre'
import { EditSecreEncontristaForm } from './EditSecreEncontristaForm'

async function getEncontrista(slug: string) {
  const encontrista = await fetch(
    `${process.env.NEXTAUTH_URL}/api/secretaria/encontrista/${slug}`,
    { cache: 'no-store' },
  ).then(async (res) => await res.json())

  return encontrista
}

export default async function EditSecreEncontrista(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const encontrista: EncontristaSecreData = await getEncontrista(params.slug)

  return <EditSecreEncontristaForm data={encontrista} />
}
