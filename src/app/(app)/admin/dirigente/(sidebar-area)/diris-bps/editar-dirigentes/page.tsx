import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { EditarDirigenteForm } from '../(form)/EditarDirisForm'

export default async function EditarDiris() {
  return (
    <div className="space-y-4 text-zinc-700">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-tertiary text-2xl font-bold">
            Editar dirigentes
          </h1>
          <span className="text-base font-normal text-zinc-500">
            Atenção: ao criar os dirigentes do próximo ano, o acesso dos
            dirigentes atuais à área exclusiva será perdido.
          </span>
        </div>
        <Link href="/admin/dirigente/diris-bps">
          <Button variant="secondary">
            <div className="flex items-center justify-center gap-2 lg:w-40">
              <ArrowLeft className="size-4" />
              <span className="hidden lg:flex">Voltar</span>
            </div>
          </Button>
        </Link>
      </div>
      <EditarDirigenteForm />
    </div>
  )
}
