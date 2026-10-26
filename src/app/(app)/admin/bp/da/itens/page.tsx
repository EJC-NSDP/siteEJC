'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BarChart4,
  Check,
  Infinity as InfinityIcon,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SearchX,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { SortableTableHead } from '@/components/Table/SortableTableHead'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SearchInput } from '@/components/ui/search-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/axios'

type CategoriaItemDA = 'CARNE' | 'SOBREMESA' | 'ACOMPANHAMENTO' | 'VEGETARIANA'

const CATEGORIAS: { value: CategoriaItemDA; label: string }[] = [
  { value: 'CARNE', label: 'Carne' },
  { value: 'SOBREMESA', label: 'Sobremesa' },
  { value: 'ACOMPANHAMENTO', label: 'Acompanhamento' },
  { value: 'VEGETARIANA', label: 'Vegetariana' },
]

const CATEGORIA_STYLE: Record<CategoriaItemDA, string> = {
  CARNE: 'bg-red-100 text-red-700',
  SOBREMESA: 'bg-yellow-100 text-yellow-700',
  ACOMPANHAMENTO: 'bg-blue-100 text-blue-700',
  VEGETARIANA: 'bg-green-100 text-green-700',
}

function CategoriaBadge({ categoria }: { categoria: CategoriaItemDA }) {
  const label =
    CATEGORIAS.find((c) => c.value === categoria)?.label ?? categoria
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${CATEGORIA_STYLE[categoria]}`}
    >
      {label}
    </span>
  )
}

interface ItemGlobal {
  id: string
  nome: string
  categoria: CategoriaItemDA
  noDAAtual: boolean
  quantidade: number | null
  inscricoesCount: number
  ultimaQuantidade: number | null
  ultimoDA: { numeroEncontro: number } | null
}

interface DAResponse {
  encontro: { id: string; numeroEncontro: number }
  da: { id: string } | null
}

export default function ItensDAPage() {
  const queryClient = useQueryClient()

  const [busca, setBusca] = useState('')
  const [buscaAtiva, setBuscaAtiva] = useState('')
  const [filtroDA, setFiltroDA] = useState('todos')
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [novaCategoria, setNovaCategoria] = useState<CategoriaItemDA | ''>('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editCategoria, setEditCategoria] = useState<CategoriaItemDA | ''>('')
  const [editQtd, setEditQtd] = useState('1')
  const [editIlimitado, setEditIlimitado] = useState(false)
  const [orderByField, setOrderByField] = useState<string | null>(null)
  const [orderByDirection, setOrderByDirection] = useState<string | null>(null)

  const { data: daData } = useQuery<DAResponse>({
    queryKey: ['da'],
    queryFn: async () => (await api.get('/da')).data,
  })

  const { data: itens, isLoading } = useQuery<ItemGlobal[]>({
    queryKey: ['da-itens'],
    queryFn: async () => (await api.get('/da/itens')).data,
  })

  const da = daData?.da

  const itensFiltrados = (itens ?? [])
    .filter((item) => {
      const matchBusca = item.nome
        .toLowerCase()
        .includes(buscaAtiva.toLowerCase())
      const matchDA =
        filtroDA === 'todos' ||
        (filtroDA === 'no_da' && item.noDAAtual) ||
        (filtroDA === 'fora_da' && !item.noDAAtual)
      const matchCat =
        filtroCategoria === 'todas' || item.categoria === filtroCategoria
      return matchBusca && matchDA && matchCat
    })
    .sort((a, b) => {
      if (!orderByField) return 0
      const dir = orderByDirection === 'desc' ? -1 : 1
      if (orderByField === 'nome')
        return a.nome.localeCompare(b.nome, 'pt-BR') * dir
      if (orderByField === 'categoria')
        return a.categoria.localeCompare(b.categoria) * dir
      return 0
    })

  function handleOrder(field: string) {
    const direction =
      orderByField === field && orderByDirection === 'asc' ? 'desc' : 'asc'
    setOrderByField(field)
    setOrderByDirection(direction)
  }

  const criarItem = useMutation({
    mutationFn: () =>
      api.post('/da/itens', {
        nome: novoNome.trim(),
        categoria: novaCategoria,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da-itens'] })
      setNovoNome('')
      setNovaCategoria('')
      setDialogAberto(false)
      toast.success('Item criado.')
    },
    onError: () => toast.error('Erro ao criar item.'),
  })

  const editarItem = useMutation({
    mutationFn: ({
      id,
      nome,
      categoria,
    }: {
      id: string
      nome: string
      categoria: CategoriaItemDA
    }) => api.patch(`/da/itens/${id}`, { nome, categoria }),
    onMutate: async ({ id, nome, categoria }) => {
      await queryClient.cancelQueries({ queryKey: ['da-itens'] })
      const previous = queryClient.getQueryData<ItemGlobal[]>(['da-itens'])
      queryClient.setQueryData<ItemGlobal[]>(['da-itens'], (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, nome, categoria } : item,
        ),
      )
      setEditandoId(null)
      return { previous }
    },
    onSuccess: () => toast.success('Item atualizado.'),
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['da-itens'], ctx.previous)
      toast.error('Erro ao atualizar item.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['da-itens'] }),
  })

  const deletarItem = useMutation({
    mutationFn: (id: string) => api.delete(`/da/itens/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da-itens'] })
      toast.success('Item removido.')
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao remover item.',
      ),
  })

  const toggleNoDA = useMutation({
    mutationFn: ({
      id,
      noDAAtual,
      quantidade,
    }: {
      id: string
      noDAAtual: boolean
      quantidade: number | null
    }) =>
      noDAAtual
        ? api.delete(`/da/itens/${id}/da?idDA=${da!.id}`)
        : api.post(`/da/itens/${id}/da`, { idDA: da!.id, quantidade }),
    onMutate: async ({ id, noDAAtual }) => {
      await queryClient.cancelQueries({ queryKey: ['da-itens'] })
      const previous = queryClient.getQueryData<ItemGlobal[]>(['da-itens'])
      queryClient.setQueryData<ItemGlobal[]>(['da-itens'], (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, noDAAtual: !noDAAtual } : item,
        ),
      )
      return { previous }
    },
    onError: (err: unknown, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['da-itens'], ctx.previous)
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao alterar item no DA.',
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['da-itens'] })
      queryClient.invalidateQueries({ queryKey: ['da'] })
    },
  })

  const atualizarQtd = useMutation({
    mutationFn: ({
      id,
      quantidade,
    }: {
      id: string
      quantidade: number | null
    }) => api.post(`/da/itens/${id}/da`, { idDA: da!.id, quantidade }),
    onMutate: async ({ id, quantidade }) => {
      await queryClient.cancelQueries({ queryKey: ['da-itens'] })
      const previous = queryClient.getQueryData<ItemGlobal[]>(['da-itens'])
      queryClient.setQueryData<ItemGlobal[]>(['da-itens'], (old) =>
        old?.map((item) => (item.id === id ? { ...item, quantidade } : item)),
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['da-itens'], ctx.previous)
      toast.error('Erro ao atualizar quantidade.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['da-itens'] }),
  })

  const replicar = useMutation({
    mutationFn: () => api.post('/da/replicar', { idDA: da!.id }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['da-itens'] })
      queryClient.invalidateQueries({ queryKey: ['da'] })
      toast.success(`${res.data.copiados} itens replicados do último DA.`)
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao replicar itens.',
      ),
  })

  function handleBuscar() {
    setBuscaAtiva(busca)
  }
  function handleLimpar() {
    setBusca('')
    setBuscaAtiva('')
    setFiltroDA('todos')
    setFiltroCategoria('todas')
  }

  const podecriar = !!novoNome.trim() && !!novaCategoria

  const CATEGORIA_BAR: Record<CategoriaItemDA, string> = {
    CARNE: 'bg-red-400',
    SOBREMESA: 'bg-yellow-400',
    ACOMPANHAMENTO: 'bg-blue-400',
    VEGETARIANA: 'bg-green-400',
  }

  const itensNoDA = (itens ?? []).filter((i) => i.noDAAtual)
  const totalInscricoes = itensNoDA.reduce((s, i) => s + i.inscricoesCount, 0)
  const statsPorCategoria = CATEGORIAS.map((cat) => {
    const count = itensNoDA
      .filter((i) => i.categoria === cat.value)
      .reduce((s, i) => s + i.inscricoesCount, 0)
    return {
      ...cat,
      count,
      pct: totalInscricoes > 0 ? (count / totalInscricoes) * 100 : 0,
    }
  })

  return (
    <div className="h-full w-full">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-8">
        <div>
          <h1 className="text-tertiary text-2xl font-bold">O que levar</h1>
          <span className="text-base font-normal text-zinc-500">
            Lista de todos os itens do DA
          </span>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {da && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto" disabled={replicar.isPending}>
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                  Replicar último DA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Replicar itens do último DA
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação vai substituir todos os itens marcados neste DA
                    pelos itens do DA anterior, com as mesmas quantidades.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => replicar.mutate()}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-1.5 h-4 w-4" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo item</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 pt-2">
                <Input
                  placeholder="Nome do item (ex: Carne (200g))"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  autoFocus
                />
                <Select
                  value={novaCategoria}
                  onValueChange={(v) => setNovaCategoria(v as CategoriaItemDA)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => criarItem.mutate()}
                  disabled={!podecriar || criarItem.isPending}
                >
                  {criarItem.isPending ? 'Criando...' : 'Criar item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Gráficos */}
      {itens && (
        <Accordion type="single" collapsible defaultValue="graficos">
          <AccordionItem
            value="graficos"
            className="rounded-xl border-none bg-white px-4"
          >
            <AccordionTrigger>
              <div className="flex items-center gap-4">
                <BarChart4 className="h-6 w-6 text-zinc-700" />
                <span className="font-bold text-zinc-700">Informações</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {totalInscricoes === 0 ? (
                <p className="pb-2 text-sm text-zinc-400">
                  Nenhuma inscrição registrada ainda.
                </p>
              ) : (
                <div className="flex flex-col gap-4 pb-2">
                  <div className="flex h-5 w-full overflow-hidden rounded-full">
                    {statsPorCategoria
                      .filter((c) => c.pct > 0)
                      .map((cat) => (
                        <div
                          key={cat.value}
                          className={`${CATEGORIA_BAR[cat.value]} transition-all`}
                          style={{ width: `${cat.pct}%` }}
                          title={`${cat.label}: ${cat.count} (${cat.pct.toFixed(1)}%)`}
                        />
                      ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {statsPorCategoria.map((cat) => (
                      <div
                        key={cat.value}
                        className="flex flex-col gap-1 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2.5 rounded-full ${CATEGORIA_BAR[cat.value]}`}
                          />
                          <span className="text-xs font-medium text-zinc-500">
                            {cat.label}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-zinc-700">
                          {cat.count}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {cat.pct.toFixed(1)}% do total
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Filtros */}
      <div className="flex flex-col gap-2 py-4 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap">
        <div className="w-full lg:flex-1">
          <SearchInput
            placeholder="Nome do item..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          />
        </div>
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger className="w-full text-nowrap sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroDA} onValueChange={setFiltroDA}>
          <SelectTrigger className="w-full text-nowrap sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os itens</SelectItem>
            <SelectItem value="no_da">Neste DA</SelectItem>
            <SelectItem value="fora_da">Fora do DA</SelectItem>
          </SelectContent>
        </Select>
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
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <SortableTableHead
                label="Nome"
                value="nome"
                classname="rounded-tl-xl pl-4"
                orderByField={orderByField}
                orderByDirection={orderByDirection}
                handleFn={handleOrder}
              />
              <SortableTableHead
                label="Categoria"
                value="categoria"
                classname="w-32"
                orderByField={orderByField}
                orderByDirection={orderByDirection}
                handleFn={handleOrder}
              />
              <TableHead className="w-24 text-center">Neste DA</TableHead>
              <TableHead className="w-28">Quantidade</TableHead>
              <TableHead className="w-28">Último DA</TableHead>
              <TableHead className="w-20 rounded-tr-xl">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-transparent">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="bg-white">
                  <TableCell className="pl-4">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-5 w-9 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-7 w-16 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && itensFiltrados.length === 0 && (
              <EmptyTableRow colspan={6} content="Nenhum item encontrado." />
            )}

            {!isLoading &&
              itensFiltrados.map((item) => {
                const editando = editandoId === item.id

                return (
                  <TableRow key={item.id} className="bg-white">
                    <TableCell className="pl-4">
                      {editando ? (
                        <Input
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                          wrapperClassName="h-9"
                          className="text-xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setEditandoId(null)
                          }}
                        />
                      ) : (
                        <span className="font-medium text-zinc-700">
                          {item.nome}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {editando ? (
                        <Select
                          value={editCategoria}
                          onValueChange={(v) =>
                            setEditCategoria(v as CategoriaItemDA)
                          }
                        >
                          <SelectTrigger className="h-9 w-36 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIAS.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <CategoriaBadge categoria={item.categoria} />
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {da ? (
                        <Switch
                          checked={item.noDAAtual}
                          onCheckedChange={() =>
                            toggleNoDA.mutate({
                              id: item.id,
                              noDAAtual: item.noDAAtual,
                              quantidade: item.ultimaQuantidade,
                            })
                          }
                        />
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {editando && item.noDAAtual && da ? (
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500">
                            {item.inscricoesCount}/
                          </span>
                          {editIlimitado ? (
                            <div className="flex h-9 w-16 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-xs text-zinc-400">
                              <InfinityIcon className="size-4" />
                            </div>
                          ) : (
                            <Input
                              type="number"
                              min={1}
                              value={editQtd}
                              onChange={(e) => setEditQtd(e.target.value)}
                              wrapperClassName="h-9 w-16"
                              className="text-xs"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setEditIlimitado((v) => !v)}
                            title="Sem limite"
                            className={
                              editIlimitado
                                ? 'text-primary'
                                : 'text-zinc-400 hover:text-zinc-600'
                            }
                          >
                            <InfinityIcon className="size-4" />
                          </button>
                        </div>
                      ) : item.noDAAtual && da ? (
                        <span className="text-zinc-700">
                          {item.inscricoesCount}/
                          {item.quantidade ?? (
                            <InfinityIcon className="inline size-3.5 text-zinc-500" />
                          )}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-zinc-500">
                      {item.ultimoDA
                        ? `${item.ultimoDA.numeroEncontro}º EJC`
                        : '—'}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editando ? (
                          <>
                            <button
                              onClick={() => {
                                editarItem.mutate({
                                  id: item.id,
                                  nome: editNome,
                                  categoria: editCategoria as CategoriaItemDA,
                                })
                                if (item.noDAAtual && da) {
                                  const novaQtd = editIlimitado
                                    ? null
                                    : parseInt(editQtd, 10)
                                  if (novaQtd !== item.quantidade)
                                    atualizarQtd.mutate({
                                      id: item.id,
                                      quantidade: novaQtd,
                                    })
                                }
                              }}
                              disabled={
                                editarItem.isPending ||
                                !editNome.trim() ||
                                !editCategoria
                              }
                              className="text-green-600 hover:text-green-700 disabled:opacity-40"
                              title="Salvar"
                            >
                              <Check className="size-3.5" />
                            </button>
                            <button
                              onClick={() => setEditandoId(null)}
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
                                setEditandoId(item.id)
                                setEditNome(item.nome)
                                setEditCategoria(item.categoria)
                                setEditIlimitado(item.quantidade === null)
                                setEditQtd(
                                  String(
                                    item.quantidade ??
                                      item.ultimaQuantidade ??
                                      1,
                                  ),
                                )
                              }}
                              className="text-zinc-400 hover:text-zinc-600"
                              title="Editar"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              onClick={() => deletarItem.mutate(item.id)}
                              disabled={deletarItem.isPending}
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
        </Table>
      </div>
    </div>
  )
}
