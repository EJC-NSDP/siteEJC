'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, SearchX, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { EmptyTableRow } from '@/components/Table/EmptyTableRow'
import { Pagination } from '@/components/Table/Pagination'
import { PaginationSkeleton } from '@/components/Table/PaginationSkeleton'
import { SortableTableHead } from '@/components/Table/SortableTableHead'
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

interface DAResponse {
  encontro: { id: string; numeroEncontro: number }
  da: { id: string } | null
}

interface NomePessoa {
  nome: string
  sobrenome: string
  apelido: string | null
}

interface PagamentoLog {
  id: string
  valor: number
  createdAt: string
  pessoa: NomePessoa
  onibus: { nome: string }
  usuario: NomePessoa
}

const perPage = 25

function nomePessoa(p: NomePessoa) {
  return p.apelido ?? `${p.nome} ${p.sobrenome}`
}

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function PagamentosOnibusPage() {
  const queryClient = useQueryClient()
  const [busca, setBusca] = useState('')
  const [buscaAtiva, setBuscaAtiva] = useState('')
  const [filtroOnibus, setFiltroOnibus] = useState('todos')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [orderByField, setOrderByField] = useState<string | null>('data')
  const [orderByDirection, setOrderByDirection] = useState<string | null>('desc')
  const [pageIndex, setPageIndex] = useState(1)

  const { data: daData, isLoading: daLoading } = useQuery<DAResponse>({
    queryKey: ['da'],
    queryFn: async () => (await api.get('/da')).data,
  })

  const da = daData?.da

  const { data: pagamentos, isLoading: pagamentosLoading } = useQuery<
    PagamentoLog[]
  >({
    queryKey: ['da-pagamentos-onibus', da?.id],
    queryFn: async () =>
      (await api.get(`/da/pagamentos-onibus?idDA=${da!.id}`)).data,
    enabled: !!da,
  })

  const isLoading = daLoading || (!!da && pagamentosLoading)

  const limparHistorico = useMutation({
    mutationFn: () =>
      api.delete(`/da/pagamentos-onibus?idDA=${da!.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['da-pagamentos-onibus', da?.id],
      })
      toast.success('Histórico de pagamentos apagado.')
    },
    onError: () => toast.error('Erro ao apagar o histórico.'),
  })

  const onibusUnicos = [
    ...new Set((pagamentos ?? []).map((p) => p.onibus.nome)),
  ].sort()

  const pagamentosFiltrados = [...(pagamentos ?? [])]
    .filter((p) => {
      const nome = nomePessoa(p.pessoa)
      if (buscaAtiva && !nome.toLowerCase().includes(buscaAtiva.toLowerCase()))
        return false
      if (filtroOnibus !== 'todos' && p.onibus.nome !== filtroOnibus)
        return false
      if (filtroTipo === 'entrada' && p.valor <= 0) return false
      if (filtroTipo === 'saida' && p.valor >= 0) return false
      return true
    })
    .sort((a, b) => {
      const dir = orderByDirection === 'asc' ? 1 : -1
      if (orderByField === 'pessoa')
        return dir * nomePessoa(a.pessoa).localeCompare(nomePessoa(b.pessoa))
      if (orderByField === 'onibus')
        return dir * a.onibus.nome.localeCompare(b.onibus.nome)
      // default: data
      return (
        dir *
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      )
    })

  const pagamentosPaginados = pagamentosFiltrados.slice(
    (pageIndex - 1) * perPage,
    pageIndex * perPage,
  )

  const total = pagamentosFiltrados.reduce((acc, p) => acc + p.valor, 0)

  function handleBuscar() {
    setBuscaAtiva(busca)
    setPageIndex(1)
  }

  function handleLimpar() {
    setBusca('')
    setBuscaAtiva('')
    setFiltroOnibus('todos')
    setFiltroTipo('todos')
    setOrderByField('data')
    setOrderByDirection('desc')
    setPageIndex(1)
  }

  function handleSort(field: string) {
    if (orderByField === field) {
      setOrderByDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrderByField(field)
      setOrderByDirection('asc')
    }
    setPageIndex(1)
  }

  function handleFiltroChange(setter: (v: string) => void) {
    return (v: string) => {
      setter(v)
      setPageIndex(1)
    }
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-4">
        <div>
          <h1 className="text-tertiary text-2xl font-bold">
            Pagamento do ônibus
          </h1>
          <span className="text-base font-normal text-zinc-500">
            Histórico de pagamentos registrados pelos BPs
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && da && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={limparHistorico.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Zerar histórico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Zerar histórico de pagamentos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Todos os lançamentos registrados pelos BPs serão
                    permanentemente excluídos. Os status de pagamento das
                    inscrições (pago/pendente) não serão alterados — apenas o
                    histórico de registros será apagado. Essa ação não pode ser
                    desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => limparHistorico.mutate()}>
                    Zerar histórico
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {!isLoading && pagamentos && (
            <div className="w-full rounded-xl bg-white px-4 py-2 shadow-sm sm:w-auto">
              <p className="font-bold text-nowrap text-zinc-700">
                <span
                  className={`text-2xl ${total >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {total > 0 ? '+' : ''}
                  {formatBRL(total)}
                </span>{' '}
                <span className="text-xs font-normal text-zinc-400">
                  {pagamentosFiltrados.length}{' '}
                  {pagamentosFiltrados.length !== 1 ? 'registros' : 'registro'}
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
            placeholder="Nome da pessoa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
          />
        </div>
        <Select
          value={filtroOnibus}
          onValueChange={handleFiltroChange(setFiltroOnibus)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os ônibus</SelectItem>
            {onibusUnicos.map((nome) => (
              <SelectItem key={nome} value={nome}>
                {nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filtroTipo}
          onValueChange={handleFiltroChange(setFiltroTipo)}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="entrada">Entradas</SelectItem>
            <SelectItem value="saida">Saídas</SelectItem>
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
        <Table className="min-w-[640px] text-xs">
          <TableHeader>
            <TableRow>
              <SortableTableHead
                label="Pessoa"
                value="pessoa"
                classname="min-w-[160px] rounded-tl-xl pl-4"
                orderByField={orderByField}
                orderByDirection={orderByDirection}
                handleFn={handleSort}
              />
              <SortableTableHead
                label="Ônibus"
                value="onibus"
                orderByField={orderByField}
                orderByDirection={orderByDirection}
                handleFn={handleSort}
              />
              <TableHead>Valor</TableHead>
              <TableHead>Registrado por</TableHead>
              <SortableTableHead
                label="Data"
                value="data"
                classname="rounded-tr-xl"
                orderByField={orderByField}
                orderByDirection={orderByDirection}
                handleFn={handleSort}
              />
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
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && !da && (
              <EmptyTableRow colspan={5} content="Nenhum DA criado ainda." />
            )}

            {!isLoading && da && pagamentosFiltrados.length === 0 && (
              <EmptyTableRow
                colspan={5}
                content={
                  pagamentos?.length === 0
                    ? 'Nenhum pagamento registrado ainda.'
                    : 'Nenhum resultado para os filtros aplicados.'
                }
              />
            )}

            {!isLoading &&
              da &&
              pagamentosFiltrados.length > 0 &&
              pagamentosPaginados.map((p) => (
                <TableRow key={p.id} className="bg-white">
                  <TableCell className="pl-4 font-medium text-zinc-700">
                    {nomePessoa(p.pessoa)}
                  </TableCell>
                  <TableCell className="text-zinc-500">{p.onibus.nome}</TableCell>
                  <TableCell
                    className={`font-medium ${p.valor >= 0 ? 'text-emerald-700' : 'text-red-600'}`}
                  >
                    {p.valor > 0 ? '+' : ''}
                    {formatBRL(p.valor)}
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {nomePessoa(p.usuario)}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {format(new Date(p.createdAt), "d 'de' MMM, HH:mm", {
                      locale: ptBR,
                    })}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            {isLoading && <PaginationSkeleton totalCol={5} />}
            {!isLoading && !!da && (
              <Pagination
                pageIndex={pageIndex}
                totalCount={pagamentosFiltrados.length}
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
