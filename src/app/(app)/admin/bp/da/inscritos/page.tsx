'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Bus,
  Car,
  Download,
  MessageCircle,
  Pencil,
  Search,
  SearchX,
  Trash2,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { Pagination } from '@/components/Table/Pagination'
import { PaginationSkeleton } from '@/components/Table/PaginationSkeleton'
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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
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
  observacao: string | null
  veiculo: { tipo: 'carro' | 'onibus'; nome: string } | null
  responsavelBP: { id: string; nome: string; avatarUrl: string | null } | null
  companheiros: string[]
}

interface DAResponse {
  encontro: { id: string; numeroEncontro: number }
  da: {
    id: string
    dataDA: string | null
    organizarTransporte: boolean
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
  const [modalEdicao, setModalEdicao] = useState<InscricaoDA | null>(null)
  const [modalItemId, setModalItemId] = useState('')
  const [modalObservacao, setModalObservacao] = useState('')

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

  const salvarEdicao = useMutation({
    mutationFn: ({
      idPessoa,
      idItem,
      observacao,
    }: {
      idPessoa: string
      idItem: string
      observacao: string
    }) =>
      api.patch(`/da/inscricoes/${idPessoa}`, {
        idDA: da!.id,
        idItem,
        observacao: observacao.trim() || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da-inscricoes', da?.id] })
      setModalEdicao(null)
      toast.success('Inscrição atualizada.')
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao atualizar.',
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
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-4">
        <div>
          <h1 className="text-tertiary text-2xl font-bold">Inscritos no DA</h1>
          <span className="text-base font-normal text-zinc-500">
            Acompanhe as inscrições, o transporte e o BP responsável de cada
            participante
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && da && (
            <Link href={`/api/export/da/inscritos-mini?idDA=${da.id}`}>
              <Button variant="secondary" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </Link>
          )}
          {!isLoading && inscricoes && (
            <div className="w-full rounded-xl bg-white px-4 py-2 shadow-sm sm:w-auto">
              <p className="font-bold text-nowrap text-zinc-700">
                <span className="text-2xl">{inscricoesFiltradas.length}</span>{' '}
                <span className="text-sm font-normal text-zinc-400">
                  {inscricoesFiltradas.length === 1 ? 'inscrito' : 'inscritos'}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap">
        <div className="w-full lg:flex-1">
          <SearchInput
            placeholder="Nome do inscrito..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          />
        </div>
        {da && da.itens.length > 0 && (
          <Select value={filtroItem} onValueChange={setFiltroItem}>
            <SelectTrigger className="w-full sm:w-44">
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
            <SelectTrigger className="w-full sm:w-44">
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleBuscar}
          >
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={handleLimpar}
          >
            <SearchX className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-transparent">
        <Table className="min-w-[640px] text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px] rounded-tl-xl pl-4">
                Nome
              </TableHead>
              <TableHead className="text-nowrap">O que vai levar</TableHead>
              <TableHead className="text-nowrap">Transporte</TableHead>
              <TableHead className="text-nowrap">BP Responsável</TableHead>
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
                      <p className="text-sm font-medium text-zinc-700">
                        {nomePessoa}
                      </p>
                      {ins.pessoa.numeroEJC && (
                        <p className="text-zinc-400">
                          {ins.pessoa.numeroEJC}º EJC
                        </p>
                      )}
                    </TableCell>

                    {/* Item */}
                    <TableCell className="text-zinc-600">
                      <div>
                        <span className="text-zinc-600">
                          {ins.descricaoItem
                            ? `${ins.descricaoItem} (${ins.item.nome})`
                            : ins.item.nome}
                        </span>
                        {ins.companheiros.length > 0 && (
                          <p className="mt-0.5 text-[11px] text-zinc-400">
                            com {ins.companheiros.join(', ')}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Transporte */}
                    <TableCell>
                      {!da.organizarTransporte &&
                      (ins.comoVai === 'DIRIGINDO' ||
                        ins.comoVai === 'CARONA') ? (
                        <p className="flex items-center gap-1 text-zinc-400">
                          <Car className="size-3" />
                          Carro
                        </p>
                      ) : ins.veiculo && comoVaiCfg ? (
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
                        (() => {
                          const selfBP = (bps ?? []).find(
                            (bp) => bp.id === ins.idPessoa,
                          )
                          const isBP = !!selfBP
                          const displayBP = isBP
                            ? {
                                id: selfBP.id,
                                nome: selfBP.nome,
                                avatarUrl: selfBP.avatarUrl,
                              }
                            : ins.responsavelBP
                          return (
                            <Select
                              value={displayBP?.id ?? 'none'}
                              disabled={isBP}
                              onValueChange={(val) =>
                                alterarBP.mutate({
                                  idPessoa: ins.idPessoa,
                                  idResponsavelBP: val === 'none' ? null : val,
                                })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue>
                                  {displayBP ? (
                                    <span className="flex items-center gap-2">
                                      <Avatar className="size-5">
                                        <AvatarImage
                                          src={displayBP.avatarUrl ?? ''}
                                        />
                                        <AvatarFallback className="text-[10px]">
                                          {displayBP.nome[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      {displayBP.nome}
                                    </span>
                                  ) : (
                                    <span className="text-zinc-400">
                                      Selecione
                                    </span>
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
                          )
                        })()
                      )}
                    </TableCell>

                    {/* Ações */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setModalEdicao(ins)
                            setModalItemId(ins.idItem)
                            setModalObservacao(ins.observacao ?? '')
                          }}
                          title={
                            ins.observacao ? 'Ver observação' : 'Sem observação'
                          }
                          className={
                            ins.observacao
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-zinc-200 hover:text-zinc-400'
                          }
                        >
                          <MessageCircle className="size-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setModalEdicao(ins)
                            setModalItemId(ins.idItem)
                            setModalObservacao(ins.observacao ?? '')
                          }}
                          className="text-zinc-400 hover:text-zinc-600"
                          title="Editar"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="text-zinc-400 hover:text-red-500"
                              title="Remover"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remover inscrição?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {ins.pessoa.nome} será removido do DA e
                                desalocado do transporte.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  removerInscricao.mutate(ins.idPessoa)
                                }
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

      {/* Modal de edição */}
      <Dialog
        open={!!modalEdicao}
        onOpenChange={(open) => {
          if (!open) setModalEdicao(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalEdicao
                ? modalEdicao.pessoa.apelido
                  ? `${modalEdicao.pessoa.apelido} (${modalEdicao.pessoa.nome})`
                  : `${modalEdicao.pessoa.nome} ${modalEdicao.pessoa.sobrenome}`
                : ''}
            </DialogTitle>
          </DialogHeader>
          {modalEdicao && da && (
            <div className="flex flex-col gap-4 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">O que vai levar</label>
                <Select value={modalItemId} onValueChange={setModalItemId}>
                  <SelectTrigger className="text-sm">
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
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Observação</label>
                <Textarea
                  value={modalObservacao}
                  onChange={(e) => setModalObservacao(e.target.value)}
                  placeholder="Nenhuma observação..."
                  className="resize-none text-sm"
                  rows={3}
                />
              </div>
              <Button
                onClick={() =>
                  salvarEdicao.mutate({
                    idPessoa: modalEdicao.idPessoa,
                    idItem: modalItemId,
                    observacao: modalObservacao,
                  })
                }
                disabled={salvarEdicao.isPending || !modalItemId}
              >
                {salvarEdicao.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
