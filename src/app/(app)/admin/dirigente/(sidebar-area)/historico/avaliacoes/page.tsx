import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth/auth-options'
import { getTodosEncontrosComAvaliacoes } from '@/app/api/avaliacao/get-historico-avaliacoes'
import { getAvaliacoesByEncontro } from '@/app/api/avaliacao/get-avaliacoes-dirigente'
import { AvaliacaoList } from '@/components/Avaliacao/AvaliacaoList'
import { EncontroSelector } from '@/components/Avaliacao/EncontroSelector'

interface Props {
  searchParams: Promise<{ encontroId?: string }>
}

export default async function HistoricoAvaliacoesPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { encontroId } = await searchParams

  const encontros = await getTodosEncontrosComAvaliacoes()

  if (encontros.length === 0) {
    return (
      <div className="space-y-4 text-zinc-700">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Histórico de Avaliações</h1>
          <p className="mt-1 text-sm text-zinc-500">Nenhum encontro cadastrado.</p>
        </div>
      </div>
    )
  }

  const encontroSelecionado = encontros.find((e) => e.id === encontroId) ?? encontros[0]
  const avaliacoes = await getAvaliacoesByEncontro(encontroSelecionado.id)

  return (
    <div className="space-y-4 text-zinc-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Histórico de Avaliações</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {avaliacoes.length} resposta{avaliacoes.length !== 1 ? 's' : ''} recebida
            {avaliacoes.length !== 1 ? 's' : ''} no {encontroSelecionado.numeroEncontro}º EJC
          </p>
        </div>
        <EncontroSelector
          encontros={encontros.map((e) => ({
            id: e.id,
            numeroEncontro: e.numeroEncontro,
            totalAvaliacoes: e._count.avaliacoes,
          }))}
          encontroSelecionadoId={encontroSelecionado.id}
        />
      </div>

      <AvaliacaoList avaliacoes={avaliacoes} />
    </div>
  )
}
