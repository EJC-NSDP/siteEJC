'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, SearchX, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { AvaliacaoList } from '@/components/Avaliacao/AvaliacaoList'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { api } from '@/lib/axios'

interface Avaliacao {
  id: string
  createdAt: string
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
  respostas: {
    id: string
    resposta: string | null
    fileUrl: string | null
    fileName: string | null
    pergunta: { chave: string; texto: string; tipo: string; ordem: number }
  }[]
  indicacoes: {
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
  }[]
}

export default function DirigenteAvaliacaoPage() {
  const queryClient = useQueryClient()
  const [busca, setBusca] = useState('')
  const [buscaAtiva, setBuscaAtiva] = useState('')

  const { data: status, isLoading: statusLoading } = useQuery<{
    isReceivingAvaliacoes: boolean
  }>({
    queryKey: ['avaliacao-status'],
    queryFn: async () => (await api.get('/avaliacao/status')).data,
  })

  const { data: avaliacoes, isLoading: avaliacoesLoading } = useQuery<
    Avaliacao[]
  >({
    queryKey: ['avaliacoes'],
    queryFn: async () => (await api.get('/avaliacao')).data,
  })

  const toggleStatus = useMutation({
    mutationFn: (isReceivingAvaliacoes: boolean) =>
      api.patch('/avaliacao/status', { isReceivingAvaliacoes }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['avaliacao-status'] }),
  })

  const isLoading = statusLoading || avaliacoesLoading
  const total = avaliacoes?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800">Avaliações</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Respostas enviadas pelos encontreiros após o encontrão
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600">Avaliações abertas?</span>
            {statusLoading ? (
              <Skeleton className="h-6 w-11" />
            ) : (
              <Switch
                checked={status?.isReceivingAvaliacoes ?? false}
                onCheckedChange={(checked) => toggleStatus.mutate(checked)}
                disabled={toggleStatus.isPending}
              />
            )}
          </div>
          <Link href="/admin/dirigente/avaliacao/perguntas">
            <Button variant="secondary">
              <Settings className="mr-2 h-4 w-4" />
              Gerenciar perguntas
            </Button>
          </Link>
        </div>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchInput
            placeholder="Nome do encontreiro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setBuscaAtiva(busca)
            }}
          />
        </div>
        <Button variant="secondary" onClick={() => setBuscaAtiva(busca)}>
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setBusca('')
            setBuscaAtiva('')
          }}
        >
          <SearchX className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      </div>

      {/* Contagem */}
      {!isLoading && (
        <p className="text-sm font-medium text-zinc-500">
          {total} resposta{total !== 1 ? 's' : ''} recebida
          {total !== 1 ? 's' : ''}
        </p>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <AvaliacaoList avaliacoes={avaliacoes ?? []} busca={buscaAtiva} />
      )}
    </div>
  )
}
