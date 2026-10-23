'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Bus,
  Car,
  Check,
  Pencil,
  Search,
  SearchX,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { Pagination } from '@/components/Table/Pagination'
import { PaginationSkeleton } from '@/components/Table/PaginationSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/axios'

type ComoVai = 'DIRIGINDO' | 'CARONA' | 'ONIBUS'

interface BP {
  id: string
  nome: string
  nomeCompleto: string
  avatarUrl: string | null
}

interface InscricaoDA {
  idPessoa: string
  idDA: string
  idItem: string
  comoVai: ComoVai | null
  createdAt: string
  pessoa: {
    id: string
    nome: string
    sobrenome: string
    apelido: string | null
    avatarUrl: string | null
    numeroEJC: number | null
  }
  item: { id: string; nome: string; quantidade: number | null }
  descricaoItem: string | null
  veiculo: { tipo: 'carro' | 'onibus'; nome: string } | null
  responsavelBP: { id: string; nome: string; avatarUrl: string | null } | null
}

interface DAResponse {
  encontro: { id: string; numeroEncontro: number }
  da: {
    id: string
    dataDA: string | null
    itens: {
      id: string
      nome: string
      quantidade: number | null
      _count: { inscricoes: number }
    }[]
  } | null
}

const COMO_VAI_CONFIG: Record<
  ComoVai,
  { label: string; labelSmall: string; icon: React.ElementType }
> = {
  DIRIGINDO: { label: 'Motorista', labelSmall: 'Motorista', icon: Car },
  CARONA: { label: 'Carona', labelSmall: 'Carona', icon: Users },
  ONIBUS: { label: 'Ônibus/van', labelSmall: 'Ônibus/van', icon: Bus },
}

export default function DAInscritosPage() {
  const queryClient = useQueryClient()

  const [busca, setBusca] = useState('')
  const [buscaAtiva, setBuscaAtiva] = useState('')
  const [filtroItem, setFiltroItem] = useState('todos')
  const [filtroBP, setFiltroBP] = useState('todos')
  const [pageIndex, setPageIndex] = useState(1)
  const perPage = 25
  const [editandoPessoa, setEditandoPessoa] = useState<string | null>(null)
  const [editItemId, setEditItemId] = useState('')

  const { data: daData, isLoading: daLoading } = useQuery<DAResponse>({
    queryKey: ['da'],
    queryFn: async () => (await api.get('/da')).data,
  })

  const da = daData?.da

  const { data: inscricoes, isLoading: inscritosLoading } = useQuery<
    InscricaoDA[]
  >({
    queryKey: ['da-inscricoes', da?.id],
    queryFn: async () => (await api.get(`/da/inscricoes?idDA=${da!.id}`)).data,
    enabled: !!da,
    refetchInterval: 30000,
  })

  const { data: bps, isLoading: bpsLoading } = useQuery<BP[]>({
    queryKey: ['da-bps'],
    queryFn: async () => (await api.get('/da/bps')).data,
    enabled: !!da,
  })

  const alterarItem = useMutation({
    mutationFn: ({ idPessoa, idItem }: { idPessoa: string; idItem: string }) =>
      api.patch(`/da/inscricoes/${idPessoa}`, { idDA: da!.id, idItem }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da-inscricoes', da?.id] })
      setEditandoPessoa(null)
      toast.success('Item atualizado.')
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao atualizar o item.',
      ),
  })

  const alterarBP = useMutation({
    mutationFn: ({
      idPessoa,
      idResponsavelBP,
    }: {
      idPessoa: string
      idResponsavelBP: string | null
    }) =>
      api.patch(`/da/inscricoes/${idPessoa}`, {
        idDA: da!.id,
        idResponsavelBP,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da-inscricoes', da?.id] })
    },
    onError: () => toast.error('Erro ao atualizar responsável.'),
  })

  const removerInscricao = useMutation({
    mutationFn: (idPessoa: string) =>
      api.delete(`/da/inscricoes/${idPessoa}?idDA=${da!.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da-inscricoes', da?.id] })
      toast.success('Inscrição removida.')
    },
    onError: () => toast.error('Erro ao remover inscrição.'),
  })

  const isLoading = daLoading || inscritosLoading

  const inscricoesFiltradas = (inscricoes ?? []).filter((ins) => {
    const nome = ins.pessoa.apelido
      ? `${ins.pessoa.apelido} ${ins.pessoa.nome}`
      : `${ins.pessoa.nome} ${ins.pessoa.sobrenome}`
    const matchBusca = nome.toLowerCase().includes(buscaAtiva.toLowerCase())
    const matchItem = filtroItem === 'todos' || ins.idItem === filtroItem
    const matchBP =
      filtroBP === 'todos' ||
      (filtroBP === 'sem' && !ins.responsavelBP) ||
      ins.responsavelBP?.id === filtroBP
    return matchBusca && matchItem && matchBP
  })

  const inscricoesPaginadas = inscricoesFiltradas.slice(
    (pageIndex - 1) * perPage,
    pageIndex * perPage,
  )

  function handleBuscar() {
    setBuscaAtiva(busca)
    setPageIndex(1)
  }
  function handleLimpar() {
    setBusca('')
    setBuscaAtiva('')
    setFiltroItem('todos')
    setFiltroBP('todos')
    setPageIndex(1)
  }

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between pb-8">
        <div>
          <h1 className="text-tertiary text-2xl font-bold">Inscritos no DA</h1>
          <span className="text-base font-normal text-zinc-500">
            Acompanhe as inscrições, o transporte e o BP responsável de cada
            participante
          </span>
        </div>
        {!isLoading && inscricoes && (
          <div className="text-right">
            <p className="text-2xl font-bold text-zinc-700">
              {inscricoesFiltradas.length}
            </p>
            <p className="text-xs text-zinc-400">
              {inscricoesFiltradas.length === 1 ? 'inscrito' : 'inscritos'}
            </p>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 py-4">
        <div className="min-w-0 flex-1">
          <SearchInput
            placeholder="Nome do inscrito..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          />
        </div>
        {da && da.itens.length > 0 && (
          <Select value={filtroItem} onValueChange={setFiltroItem}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os itens</SelectItem>
              {da.itens.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!bpsLoading && bps && bps.length > 0 && (
          <Select value={filtroBP} onValueChange={setFiltroBP}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Todos os BPs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os BPs</SelectItem>
              <SelectItem value="sem">Sem BP</SelectItem>
              {bps.map((bp) => (
                <SelectItem key={bp.id} value={bp.id}>
                  {bp.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleBuscar}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button variant="destructive" onClick={handleLimpar}>
            <SearchX className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-transparent">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="rounded-tl-xl pl-4">Nome</TableHead>
              <TableHead>O que vai levar</TableHead>
              <TableHead>Transporte</TableHead>
              <TableHead>BP Responsável</TableHead>
              <TableHead className="w-20 rounded-tr-xl">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-transparent">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="bg-white">
                  <TableCell className="pl-4">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && inscricoesFiltradas.length === 0 && (
              <EmptyTableRow
                colspan={5}
                content={
                  inscricoes?.length === 0
                    ? 'Nenhum inscrito ainda.'
                    : 'Nenhum resultado para a busca.'
                }
              />
            )}

            {!isLoading &&
              da &&
              inscricoesPaginadas.map((ins) => {
                const editando = editandoPessoa === ins.idPessoa
                const nomePessoa = ins.pessoa.apelido
                  ? `${ins.pessoa.apelido} (${ins.pessoa.nome})`
                  : `${ins.pessoa.nome} ${ins.pessoa.sobrenome}`
                const comoVaiCfg = ins.comoVai
                  ? COMO_VAI_CONFIG[ins.comoVai]
                  : null
                return (
                  <TableRow key={ins.idPessoa} className="bg-white">
                    {/* Nome */}
                    <TableCell className="pl-4">
                      <p className="font-medium text-zinc-700">{nomePessoa}</p>
                      {ins.pessoa.numeroEJC && (
                        <p className="text-zinc-400">
                          {ins.pessoa.numeroEJC}º EJC
                        </p>
                      )}
                    </TableCell>

                    {/* Item */}
                    <TableCell className="text-zinc-600">
                      {editando ? (
                        <Select
                          value={editItemId}
                          onValueChange={setEditItemId}
                          disabled={alterarItem.isPending}
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {da.itens.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : ins.descricaoItem ? (
                        `${ins.descricaoItem} (${ins.item.nome})`
                      ) : (
                        ins.item.nome
                      )}
                    </TableCell>

                    {/* Transporte */}
                    <TableCell>
                      {ins.veiculo && comoVaiCfg ? (
                        <div>
                          <p className="font-medium text-zinc-700">
                            {ins.veiculo.nome}
                          </p>
                          <p className="flex items-center gap-1 text-zinc-400">
                            <comoVaiCfg.icon className="size-3" />
                            {comoVaiCfg.labelSmall}
                          </p>
                        </div>
                      ) : comoVaiCfg ? (
                        <p className="flex items-center gap-1 text-zinc-400">
                          <comoVaiCfg.icon className="size-3" />
                          {comoVaiCfg.label}
                        </p>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </TableCell>

                    {/* BP Responsável */}
                    <TableCell className="w-44">
                      {bpsLoading ? (
                        <Skeleton className="h-8 w-36" />
                      ) : (
                        <Select
                          value={ins.responsavelBP?.id ?? 'none'}
                          onValueChange={(val) =>
                            alterarBP.mutate({
                              idPessoa: ins.idPessoa,
                              idResponsavelBP: val === 'none' ? null : val,
                            })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue>
                              {ins.responsavelBP ? (
                                <span className="flex items-center gap-2">
                                  <Avatar className="size-5">
                                    <AvatarImage
                                      src={ins.responsavelBP.avatarUrl ?? ''}
                                    />
                                    <AvatarFallback className="text-[10px]">
                                      {ins.responsavelBP.nome[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  {ins.responsavelBP.nome}
                                </span>
                              ) : (
                                <span className="text-zinc-400">Selecione</span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <span className="text-zinc-400">Nenhum</span>
                            </SelectItem>
                            {(bps ?? []).map((bp) => (
                              <SelectItem key={bp.id} value={bp.id}>
                                <span className="flex items-center gap-2">
                                  <Avatar className="size-5">
                                    <AvatarImage src={bp.avatarUrl ?? ''} />
                                    <AvatarFallback className="text-[10px]">
                                      {bp.nome[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  {bp.nome}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>

                    {/* Ações */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editando ? (
                          <>
                            <button
                              onClick={() =>
                                alterarItem.mutate({
                                  idPessoa: ins.idPessoa,
                                  idItem: editItemId,
                                })
                              }
                              disabled={alterarItem.isPending || !editItemId}
                              className="text-green-600 hover:text-green-700 disabled:opacity-40"
                              title="Salvar"
                            >
                              <Check className="size-3.5" />
                            </button>
                            <button
                              onClick={() => setEditandoPessoa(null)}
                              className="text-zinc-400 hover:text-zinc-600"
                              title="Cancelar"
                            >
                              <X className="size-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditandoPessoa(ins.idPessoa)
                                setEditItemId(ins.idItem)
                              }}
                              className="text-zinc-400 hover:text-zinc-600"
                              title="Editar item"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                removerInscricao.mutate(ins.idPessoa)
                              }
                              disabled={removerInscricao.isPending}
                              className="text-zinc-400 hover:text-red-500"
                              title="Remover"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
          <TableFooter>
            {isLoading && <PaginationSkeleton totalCol={5} />}
            {!isLoading && !!da && (
              <Pagination
                pageIndex={pageIndex}
                totalCount={inscricoesFiltradas.length}
                perPage={perPage}
                totalCol={5}
                onPageChange={(idx) => setPageIndex(idx + 1)}
              />
            )}
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
