import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { EditarBPsForm } from '../(form)/EditarBPsForm'

export default async function EditarBPs() {
  return (
    <div className="space-y-4 text-zinc-700">
      <div className="flex items-center justify-between">
        <span className="text-2xl leading-none font-semibold tracking-tight">
          Editar BPs
        </span>
        <Link href="/admin/dirigente/diris-bps">
          <Button variant="secondary">
            <div className="flex items-center justify-center gap-2 lg:w-40">
              <ArrowLeft className="size-4" />
              <span className="hidden lg:flex">Voltar</span>
            </div>
          </Button>
        </Link>
      </div>
      <EditarBPsForm />
    </div>
  )
}
