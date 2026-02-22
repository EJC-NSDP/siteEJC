import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { AdicionarPastoralForm } from '../(form)/AdicionarPastoralForm'

import { Button } from '@/components/ui/button'

export default async function AdicionarPastoral() {
  return (
    <div className="space-y-4 text-zinc-700">
      <div className="flex items-center justify-between">
        <span className="text-2xl leading-none font-semibold tracking-tight">
          Adicionar encontreiro a pastoral
        </span>
        <Link href="/admin/secretaria/pastorais">
          <Button variant="secondary">
            <div className="flex items-center justify-center gap-2 lg:w-40">
              <ArrowLeft className="size-4" />
              <span className="hidden lg:flex">Voltar</span>
            </div>
          </Button>
        </Link>
      </div>
      <AdicionarPastoralForm />
    </div>
  )
}
