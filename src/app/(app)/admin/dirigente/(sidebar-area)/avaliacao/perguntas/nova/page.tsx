import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { NovaPerguntaForm } from '@/components/Avaliacao/NovaPerguntaForm'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth/auth-options'

export default async function NovaPerguntaPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="space-y-4 text-zinc-700">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Nova Pergunta</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Adicione uma nova pergunta à avaliação do encontrão.
          </p>
        </div>
        <Link href="/admin/dirigente/avaliacao/perguntas">
          <Button variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <NovaPerguntaForm />
    </div>
  )
}
