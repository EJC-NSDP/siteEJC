import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

import { authOptions } from '@/lib/auth/auth-options'
import { getPerguntas } from '@/app/api/avaliacao/get-perguntas'
import { Button } from '@/components/ui/button'
import { PerguntasEditor } from '@/components/Avaliacao/PerguntasEditor'

export default async function PerguntasAvaliacaoPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const perguntas = await getPerguntas()

  return (
    <div className="space-y-4 text-zinc-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Perguntas da Avaliação</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Edite o texto e a descrição de cada pergunta. Perguntas marcadas com{' '}
            <span className="font-medium">funcionalidade especial</span> não podem ser removidas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dirigente/avaliacao/perguntas/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova pergunta
            </Button>
          </Link>
          <Link href="/admin/dirigente/avaliacao">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>

      <PerguntasEditor
        perguntas={perguntas.map((p) => ({
          ...p,
          tipo: p.tipo as 'TEXTO_LONGO' | 'INDICACOES' | 'ARQUIVO',
          categoria: p.categoria as 'SUA_EQUIPE' | 'CANDIDATOS' | 'O_ENCONTRAO' | 'PARA_O_FUTURO' | 'DIRIGENCIA' | 'OUTROS',
        }))}
      />
    </div>
  )
}
