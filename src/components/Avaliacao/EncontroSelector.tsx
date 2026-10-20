'use client'

import { useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EncontroOption {
  id: string
  numeroEncontro: number
  totalAvaliacoes: number
}

interface EncontroSelectorProps {
  encontros: EncontroOption[]
  encontroSelecionadoId: string
}

export function EncontroSelector({
  encontros,
  encontroSelecionadoId,
}: EncontroSelectorProps) {
  const router = useRouter()

  return (
    <Select
      value={encontroSelecionadoId}
      onValueChange={(id) => router.push(`?encontroId=${id}`)}
    >
      <SelectTrigger className="w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {encontros.map((e) => (
          <SelectItem key={e.id} value={e.id}>
            {e.numeroEncontro}º EJC
            <span className="ml-1 text-zinc-400">({e.totalAvaliacoes})</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
