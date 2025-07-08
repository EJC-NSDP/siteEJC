import type { EncontreiroMontagemData } from '@/app/api/montagem/[slug]/get-encontreiro'
import { CardEncontreiro } from './CardEncontreiro'

async function getEncontreiroData(slug: string) {
  return await fetch(`${process.env.NEXTAUTH_URL}/api/montagem/${slug}`, {
    cache: 'no-store',
  }).then(async (res) => await res.json())
}

export default async function MontagemScan(props: {
  params: Promise<{ slug: string }>
}) {
  const encontreiro: EncontreiroMontagemData = await getEncontreiroData(
    (await props.params).slug,
  )

  return (
    <div className="w-full px-4 py-4 lg:px-32">
      <CardEncontreiro encontreiro={encontreiro} />
    </div>
  )
}
