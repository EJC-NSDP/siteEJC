'use client'

import { ChevronDown, ChevronUp, Download, Trash2, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { api } from '@/lib/axios'

interface Indicacao {
  id: string
  avaliacao: string
  equipe: { equipeLabel: string; equipeValue: string }
  encontreiro: {
    idPessoa: string
    pessoa: {
      nome: string
      sobrenome: string
      apelido: string | null
      avatarUrl: string | null
    }
  }
}

interface Resposta {
  id: string
  resposta: string | null
  fileUrl: string | null
  fileName: string | null
  pergunta: { chave: string; texto: string; tipo: string; ordem: number }
}

interface Avaliacao {
  id: string
  createdAt: string | Date
  autor: {
    id: string
    nome: string
    sobrenome: string
    apelido: string | null
    avatarUrl: string | null
    encontreiro?: {
      equipeMontagem?: { equipe?: { equipeLabel: string } | null } | null
    } | null
  }
  respostas: Resposta[]
  indicacoes: Indicacao[]
}

interface AvaliacaoListProps {
  avaliacoes: Avaliacao[]
  busca?: string
}

export function AvaliacaoList({
  avaliacoes: initial,
  busca = '',
}: AvaliacaoListProps) {
  const [avaliacoes, setAvaliacoes] = useState(initial)

  function handleDeleted(id: string) {
    setAvaliacoes((prev) => prev.filter((a) => a.id !== id))
  }

  const filtradas = busca
    ? avaliacoes.filter((a) =>
        `${a.autor.nome} ${a.autor.sobrenome} ${a.autor.apelido ?? ''}`
          .toLowerCase()
          .includes(busca.toLowerCase()),
      )
    : avaliacoes

  if (filtradas.length === 0) {
    return (
      <p className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-400">
        {busca
          ? 'Nenhuma avaliação encontrada para esta busca.'
          : 'Nenhuma avaliação recebida ainda.'}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {filtradas.map((a) => (
        <AvaliacaoCard key={a.id} avaliacao={a} onDeleted={handleDeleted} />
      ))}
    </div>
  )
}

function AvaliacaoCard({
  avaliacao,
  onDeleted,
}: {
  avaliacao: Avaliacao
  onDeleted: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const nomeAutor = `${avaliacao.autor.nome} ${avaliacao.autor.sobrenome}`
  const fallback =
    avaliacao.autor.nome[0].toUpperCase() +
    avaliacao.autor.sobrenome[0].toUpperCase()
  const equipeLabel =
    avaliacao.autor.encontreiro?.equipeMontagem?.equipe?.equipeLabel ?? null

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`avaliacao/${avaliacao.id}`)
      toast.success('Avaliação removida.')
      onDeleted(avaliacao.id)
    } catch {
      toast.error('Erro ao remover avaliação.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      {/* Header */}
      <div className="flex w-full items-center justify-between p-4">
        <button
          type="button"
          className="flex flex-1 items-center gap-3 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={avaliacao.autor.avatarUrl ?? ''} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-zinc-800">{nomeAutor}</p>
            <div className="mt-0.5 flex items-center gap-2">
              {avaliacao.autor.apelido && (
                <p className="text-xs text-zinc-400">
                  {avaliacao.autor.apelido}
                </p>
              )}
              {equipeLabel && (
                <Badge variant="secondary" className="py-0 text-xs">
                  {equipeLabel}
                </Badge>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            {new Date(avaliacao.createdAt).toLocaleDateString('pt-BR')}
          </span>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-red-500"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-80">
              <AlertDialogHeader className="flex flex-col gap-2">
                <AlertDialogTitle>Atenção!</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover a avaliação de{' '}
                  <span className="font-bold">{nomeAutor}</span>?
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={deleting}
                    className="disabled:cursor-wait disabled:opacity-50"
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="disabled:cursor-wait disabled:opacity-50"
                  >
                    {deleting ? 'Removendo...' : 'Remover'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-zinc-400"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="flex flex-col gap-6 border-t border-zinc-100 p-4">
          {avaliacao.respostas.map((r) => (
            <div key={r.id} className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-zinc-700">
                {r.pergunta.texto}
              </p>
              {r.pergunta.tipo === 'ARQUIVO' ? (
                r.fileUrl ? (
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Download className="h-4 w-4" />
                    {r.fileName ?? 'Baixar arquivo'}
                  </a>
                ) : (
                  <p className="text-sm text-zinc-400 italic">
                    Nenhum arquivo enviado.
                  </p>
                )
              ) : (
                <p className="text-sm whitespace-pre-wrap text-zinc-600">
                  {r.resposta || (
                    <span className="text-zinc-400 italic">Sem resposta.</span>
                  )}
                </p>
              )}
            </div>
          ))}

          {avaliacao.indicacoes.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-zinc-700">Indicações</p>
              {avaliacao.indicacoes.map((ind) => (
                <div
                  key={ind.id}
                  className="flex flex-col gap-2 rounded-md border border-zinc-100 bg-zinc-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <HoverCard openDelay={100} closeDelay={50}>
                      <HoverCardTrigger asChild>
                        <Avatar className="h-7 w-7 cursor-pointer">
                          <AvatarImage
                            src={ind.encontreiro.pessoa.avatarUrl ?? ''}
                          />
                          <AvatarFallback>
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                      {ind.encontreiro.pessoa.avatarUrl && (
                        <HoverCardContent className="w-auto p-2" side="top">
                          <Avatar className="h-32 w-32">
                            <AvatarImage
                              src={ind.encontreiro.pessoa.avatarUrl}
                              className="object-cover"
                            />
                          </Avatar>
                        </HoverCardContent>
                      )}
                    </HoverCard>
                    <span className="text-sm font-medium text-zinc-700">
                      {ind.encontreiro.pessoa.nome}{' '}
                      {ind.encontreiro.pessoa.sobrenome}
                      {ind.encontreiro.pessoa.apelido && (
                        <span className="ml-1 text-zinc-400">
                          ({ind.encontreiro.pessoa.apelido})
                        </span>
                      )}
                    </span>
                    <Badge variant="secondary">{ind.equipe.equipeLabel}</Badge>
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-zinc-600">
                    {ind.avaliacao}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
