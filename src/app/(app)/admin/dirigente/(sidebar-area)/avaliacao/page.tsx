import { Settings } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import {
  getUltimoEncontro,
  getAvaliacoesByEncontro,
} from '@/app/api/avaliacao/get-avaliacoes-dirigente'
import { AvaliacaoList } from '@/components/Avaliacao/AvaliacaoList'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth/auth-options'

export default async function DirigenteAvaliacaoPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const encontro = await getUltimoEncontro()

  if (!encontro) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-zinc-800">Avaliações</h1>
        <p className="text-zinc-500">Nenhum encontro configurado.</p>
      </div>
    )
  }

  const avaliacoes = await getAvaliacoesByEncontro(encontro.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">
            Avaliações — {encontro.numeroEncontro}º EJC
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {avaliacoes.length} resposta{avaliacoes.length !== 1 ? 's' : ''}{' '}
            recebida
            {avaliacoes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/dirigente/avaliacao/perguntas">
          <Button variant="secondary">
            <Settings className="mr-2 h-4 w-4" />
            Gerenciar perguntas
          </Button>
        </Link>
      </div>

      <AvaliacaoList avaliacoes={avaliacoes} />
    </div>
  )
}
