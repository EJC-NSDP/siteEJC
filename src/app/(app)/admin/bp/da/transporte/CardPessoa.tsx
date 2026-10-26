'use client'

import { useDraggable, type UniqueIdentifier } from '@dnd-kit/core'
import { GripVertical, UserCheck } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface SortablePessoa {
  id: UniqueIdentifier
  vehicleId: string
  content: {
    nome: string
    comoVai: string | null
    pagouOnibus: boolean
    numEncontro: number | null
    nomeBP: string | null
  }
}

export interface PessoaDragData {
  type: 'Pessoa'
  pessoa: SortablePessoa
}

interface CardPessoaProps {
  pessoa: SortablePessoa
  isOverlay?: boolean
  compact?: boolean
  actions?: ReactNode
}

export function CardPessoa({
  pessoa,
  isOverlay,
  compact,
  actions,
}: CardPessoaProps) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: pessoa.id,
    data: { type: 'Pessoa', pessoa } satisfies PessoaDragData,
    attributes: { roleDescription: 'Pessoa' },
  })

  if (compact) {
    return (
      <Card
        ref={setNodeRef}
        className={cn(
          isDragging && !isOverlay && 'ring-primary/20 opacity-30 ring-2',
          isOverlay && 'ring-primary cursor-grabbing shadow-lg ring-2',
        )}
      >
        <div className="flex items-center gap-1 px-2 py-1.5">
          <div className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-zinc-700">
              {pessoa.content.nome}
            </span>
            {pessoa.content.numEncontro && (
              <p className="text-[10px] text-zinc-400">
                {pessoa.content.numEncontro}º EJC
              </p>
            )}
          </div>
          <button
            className="shrink-0 cursor-grab touch-none text-zinc-300 hover:text-zinc-500"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-3" />
          </button>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-1 px-2 py-1">
          <span className="flex min-w-0 items-center gap-1 truncate text-[11px] text-zinc-400">
            <UserCheck className="size-3 shrink-0" />
            {pessoa.content.nomeBP ?? '-'}
          </span>
          <div className="shrink-0">{actions}</div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        isDragging && !isOverlay && 'ring-primary/20 opacity-30 ring-2',
        isOverlay && 'ring-primary cursor-grabbing shadow-lg ring-2',
      )}
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="min-w-0 flex-1">
          <span className="block truncate font-medium text-zinc-700">
            {pessoa.content.nome}
          </span>
          {pessoa.content.numEncontro && (
            <p className="text-xs text-zinc-400">
              {pessoa.content.numEncontro}º EJC
            </p>
          )}
        </div>
        <button
          className="shrink-0 cursor-grab touch-none text-zinc-300 hover:text-zinc-500"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </div>
      <Separator />
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="flex min-w-0 items-center gap-1 truncate text-sm text-zinc-400">
          <UserCheck className="size-3.5 shrink-0" />
          {pessoa.content.nomeBP ?? '-'}
        </span>
        <div className="shrink-0">{actions}</div>
      </div>
    </Card>
  )
}
