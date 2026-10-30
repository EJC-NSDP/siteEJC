'use client'

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  Banknote,
  Bus,
  Car,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

import {
  CardPessoa,
  type PessoaDragData,
  type SortablePessoa,
} from './CardPessoa'

type ComoVai = 'DIRIGINDO' | 'CARONA' | 'ONIBUS'

interface Pessoa {
  id: string
  nome: string
  sobrenome: string
  apelido: string | null
  avatarUrl: string | null
  numEncontro: number | null
}

interface PassageiroCarro {
  idPessoa: string
  pessoa: Pessoa
  comoVai: ComoVai | null
  nomeBP: string | null
  conviteStatus: 'PENDENTE' | 'ACEITO' | 'RECUSADO' | null
}

interface PassageiroOnibus {
  idPessoa: string
  pessoa: Pessoa
  pagouOnibus: boolean
  pendentePagamento: boolean
  valorPago: number | null
  comoVai: ComoVai | null
  nomeBP: string | null
}

interface CarroDA {
  id: string
  modelo: string | null
  placa: string | null
  vagas: number
  motorista: Pessoa
  passageiros: PassageiroCarro[]
  convitesPendentes: { idPessoa: string; pessoa: Pessoa }[]
  vagasOcupadas: number
  vagasLivres: number
}

interface OnibusDA {
  id: string
  nome: string
  vagas: number | null
  valorPorPessoa: number
  passageiros: PassageiroOnibus[]
}

interface PessoaSemVeiculo {
  idPessoa: string
  pessoa: Pessoa
  comoVai: ComoVai | null
  nomeBP: string | null
  conviteMotorista: string | null
  pagouOnibus: boolean
  valorPago: number | null
}

interface TransporteData {
  carros: CarroDA[]
  onibus: OnibusDA[]
  semVeiculo: PessoaSemVeiculo[]
  stats: {
    total: number
    dirigindo: number
    carona: number
    onibus: number
    semTransporte: number
  }
}

interface DAResponse {
  encontro: { id: string; numeroEncontro: number }
  da: { id: string; organizarTransporte: boolean } | null
}

function nomePessoa(p: Pessoa) {
  return `${p.nome} ${p.sobrenome}`
}

function buildPessoas(transporte: TransporteData): SortablePessoa[] {
  const result: SortablePessoa[] = []
  for (const p of transporte.semVeiculo) {
    result.push({
      id: p.idPessoa,
      vehicleId: 'sem-veiculo',
      content: {
        nome: nomePessoa(p.pessoa),
        avatarUrl: p.pessoa.avatarUrl,
        comoVai: p.comoVai,
        pagouOnibus: p.pagouOnibus,
        pendentePagamento: false,
        valorPago: p.valorPago,
        numEncontro: p.pessoa.numEncontro,
        nomeBP: p.nomeBP,
        conviteMotorista: p.conviteMotorista,
        conviteStatus: null,
      },
    })
  }
  for (const carro of transporte.carros) {
    for (const p of carro.passageiros) {
      if (p.comoVai === 'DIRIGINDO') continue
      result.push({
        id: p.idPessoa,
        vehicleId: `carro-${carro.id}`,
        content: {
          nome: nomePessoa(p.pessoa),
          avatarUrl: p.pessoa.avatarUrl,
          comoVai: p.comoVai,
          pagouOnibus: false,
          pendentePagamento: false,
          valorPago: null,
          numEncontro: p.pessoa.numEncontro,
          nomeBP: p.nomeBP,
          conviteMotorista: null,
          conviteStatus: p.conviteStatus,
        },
      })
    }
  }
  for (const onibus of transporte.onibus) {
    for (const p of onibus.passageiros) {
      result.push({
        id: p.idPessoa,
        vehicleId: `onibus-${onibus.id}`,
        content: {
          nome: nomePessoa(p.pessoa),
          avatarUrl: p.pessoa.avatarUrl,
          comoVai: p.comoVai,
          pagouOnibus: p.pagouOnibus,
          pendentePagamento: p.pendentePagamento,
          valorPago: p.valorPago,
          numEncontro: p.pessoa.numEncontro,
          nomeBP: p.nomeBP,
          conviteMotorista: null,
          conviteStatus: null,
        },
      })
    }
  }
  return result
}

// ── Droppable ────────────────────────────────────────────────────────────────

function Droppable({
  id,
  children,
  className,
}: {
  id: UniqueIdentifier
  children: React.ReactNode
  className?: string
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'Container', accepts: ['Pessoa'] },
  })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-10 rounded-lg transition-colors',
        isOver && 'bg-primary/5 ring-primary/30 ring-2',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ── Motorista (like TioCirculo) ───────────────────────────────────────────────

function MotoristaSection({
  motorista,
  nomeBP,
  pendente,
}: {
  motorista: Pessoa
  nomeBP: string | null
  pendente: boolean
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 px-1">
        <p className="min-w-0 flex-1 font-medium text-zinc-700">
          {nomePessoa(motorista)}
          {motorista.numEncontro && (
            <span className="font-normal text-zinc-500">
              {' '}
              - {motorista.numEncontro}º EJC
            </span>
          )}
        </p>
        {pendente && (
          <span title="Motorista ainda não confirmou">
            <Clock className="size-3.5 shrink-0 text-amber-400" />
          </span>
        )}
      </div>
      <Separator className="my-2" />
      <div className="flex items-center gap-2 px-1 pb-1 text-sm text-zinc-400">
        <Car className="size-4" />
        <span>Motorista</span>
        <span className="mx-0.5">|</span>
        <span title="BP responsável" className="flex items-center gap-1">
          <UserCheck className="size-3.5" />
          {nomeBP ?? '-'}
        </span>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TransportePage() {
  const queryClient = useQueryClient()
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const [pessoas, setPessoas] = useState<SortablePessoa[]>([])
  const [activePessoa, setActivePessoa] = useState<SortablePessoa | null>(null)
  const [originalVehicleId, setOriginalVehicleId] = useState<string | null>(
    null,
  )
  const movePendingRef = useRef(false)
  const paymentPendingRef = useRef(false)

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  function toggleCollapse(id: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const [novoOnibusAberto, setNovoOnibusAberto] = useState(false)
  const [novoOnibusNome, setNovoOnibusNome] = useState('')
  const [novoOnibusVagas, setNovoOnibusVagas] = useState('')
  const [novoOnibusValor, setNovoOnibusValor] = useState('')

  const [editandoCarro, setEditandoCarro] = useState<string | null>(null)
  const [editCarroModelo, setEditCarroModelo] = useState('')
  const [editCarroPlaca, setEditCarroPlaca] = useState('')
  const [editCarroVagas, setEditCarroVagas] = useState('')

  const [editandoOnibus, setEditandoOnibus] = useState<string | null>(null)
  const [editOnibusNome, setEditOnibusNome] = useState('')
  const [editOnibusVagas, setEditOnibusVagas] = useState('')
  const [editOnibusValor, setEditOnibusValor] = useState('')

  const [convertendoMotorista, setConvertendoMotorista] = useState<{
    idPessoa: string
    nome: string
  } | null>(null)
  const [motoristaModelo, setMotoristaModelo] = useState('')
  const [motoristaPlaca, setMotoristaPlaca] = useState('')
  const [motoristaVagas, setMotoristaVagas] = useState('4')

  const { data: daData, isLoading: daLoading } = useQuery<DAResponse>({
    queryKey: ['da'],
    queryFn: async () => (await api.get('/da')).data,
  })

  const da = daData?.da

  const { data: transporte, isLoading: transporteLoading } =
    useQuery<TransporteData>({
      queryKey: ['da-transporte', da?.id],
      queryFn: async () =>
        (await api.get(`/da/transporte?idDA=${da!.id}`)).data,
      enabled: !!da,
      refetchInterval: 30000,
    })

  const isLoading = daLoading || transporteLoading

  useEffect(() => {
    if (transporte && !activePessoa && !movePendingRef.current && !paymentPendingRef.current)
      setPessoas(buildPessoas(transporte))
  }, [transporte, activePessoa])

  function invalidar() {
    queryClient.invalidateQueries({ queryKey: ['da-transporte', da?.id] })
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  const mover = useMutation({
    mutationFn: async ({
      idPessoa,
      vehicleId,
    }: {
      idPessoa: string
      vehicleId: string
    }) => {
      let idCarroDA: string | null = null
      let idOnibusDA: string | null = null
      if (vehicleId.startsWith('carro-'))
        idCarroDA = vehicleId.replace('carro-', '')
      else if (vehicleId.startsWith('onibus-'))
        idOnibusDA = vehicleId.replace('onibus-', '')
      return api.patch(`/da/inscricoes/${idPessoa}`, {
        idDA: da!.id,
        idCarroDA,
        idOnibusDA,
      })
    },
    onMutate: () => {
      movePendingRef.current = true
    },
    onSuccess: () => {
      invalidar()
    },
    onSettled: () => {
      movePendingRef.current = false
    },
    onError: () => {
      invalidar()
      toast.error('Erro ao mover pessoa.')
    },
  })

  const togglePagamento = useMutation({
    mutationFn: ({
      idPessoa,
      pagouOnibus,
      valorPorOnibus,
    }: {
      idPessoa: string
      pagouOnibus: boolean
      valorPorOnibus: number
    }) =>
      api.patch(`/da/inscricoes/${idPessoa}`, { idDA: da!.id, pagouOnibus }),
    onMutate: ({ idPessoa, pagouOnibus, valorPorOnibus }) => {
      paymentPendingRef.current = true
      setPessoas((prev) =>
        prev.map((p) =>
          String(p.id) === idPessoa
            ? {
                ...p,
                content: {
                  ...p.content,
                  pagouOnibus,
                  pendentePagamento: false,
                  valorPago: pagouOnibus ? valorPorOnibus : null,
                },
              }
            : p,
        ),
      )
    },
    onSuccess: () => invalidar(),
    onSettled: () => {
      paymentPendingRef.current = false
    },
    onError: () => {
      toast.error('Erro ao atualizar pagamento.')
    },
  })

  const corrigirPagamento = useMutation({
    mutationFn: ({
      idPessoa,
      valorPorOnibus,
    }: {
      idPessoa: string
      valorPorOnibus: number
    }) =>
      api.patch(`/da/inscricoes/${idPessoa}`, {
        idDA: da!.id,
        corrigirValorPago: true,
      }),
    onMutate: ({ idPessoa, valorPorOnibus }) => {
      paymentPendingRef.current = true
      setPessoas((prev) =>
        prev.map((p) =>
          String(p.id) === idPessoa
            ? { ...p, content: { ...p.content, valorPago: valorPorOnibus } }
            : p,
        ),
      )
    },
    onSuccess: () => invalidar(),
    onSettled: () => {
      paymentPendingRef.current = false
    },
    onError: () => {
      toast.error('Erro ao corrigir pagamento.')
    },
  })

  const devolverPagamento = useMutation({
    mutationFn: ({ idPessoa }: { idPessoa: string }) =>
      api.patch(`/da/inscricoes/${idPessoa}`, {
        idDA: da!.id,
        devolverPagamento: true,
      }),
    onMutate: ({ idPessoa }) => {
      paymentPendingRef.current = true
      setPessoas((prev) =>
        prev.map((p) =>
          String(p.id) === idPessoa
            ? { ...p, content: { ...p.content, pagouOnibus: false, valorPago: null } }
            : p,
        ),
      )
    },
    onSuccess: () => invalidar(),
    onSettled: () => {
      paymentPendingRef.current = false
    },
    onError: () => {
      invalidar()
      toast.error('Erro ao registrar devolução.')
    },
  })

  const editarCarro = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/da/carros/${id}`, {
        modelo: editCarroModelo || undefined,
        placa: editCarroPlaca || undefined,
        vagas: Number(editCarroVagas),
      }),
    onSuccess: () => {
      invalidar()
      setEditandoCarro(null)
      toast.success('Carro atualizado.')
    },
    onError: () => toast.error('Erro ao atualizar carro.'),
  })

  const excluirCarro = useMutation({
    mutationFn: (id: string) => api.delete(`/da/carros/${id}`),
    onSuccess: () => {
      invalidar()
      toast.success('Carro removido.')
    },
    onError: () => toast.error('Erro ao remover carro.'),
  })

  const editarOnibus = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/da/onibus/${id}`, {
        nome: editOnibusNome,
        vagas: editOnibusVagas ? Number(editOnibusVagas) : null,
        valorPorPessoa: Number(editOnibusValor),
      }),
    onSuccess: () => {
      invalidar()
      setEditandoOnibus(null)
      toast.success('Ônibus atualizado.')
    },
    onError: () => toast.error('Erro ao atualizar ônibus.'),
  })

  const converterEmMotorista = useMutation({
    mutationFn: async (idPessoa: string) => {
      const { data: carro } = await api.post('/da/carros', {
        idDA: da!.id,
        idMotorista: idPessoa,
        modelo: motoristaModelo || undefined,
        placa: motoristaPlaca || undefined,
        vagas: Number(motoristaVagas) || 4,
      })
      await api.patch(`/da/inscricoes/${idPessoa}`, {
        idDA: da!.id,
        comoVai: 'DIRIGINDO',
        idCarroDA: carro.id,
      })
    },
    onSuccess: () => {
      invalidar()
      setConvertendoMotorista(null)
      setMotoristaModelo('')
      setMotoristaPlaca('')
      setMotoristaVagas('4')
      toast.success('Motorista adicionado.')
    },
    onError: () => toast.error('Erro ao converter em motorista.'),
  })

  const criarOnibus = useMutation({
    mutationFn: ({
      nome,
      vagas,
      valorPorPessoa,
    }: {
      nome: string
      vagas: number | null
      valorPorPessoa: number
    }) => api.post('/da/onibus', { idDA: da!.id, nome, vagas, valorPorPessoa }),
    onMutate: async ({ nome, vagas, valorPorPessoa }) => {
      await queryClient.cancelQueries({ queryKey: ['da-transporte', da?.id] })
      const previous = queryClient.getQueryData<TransporteData>([
        'da-transporte',
        da?.id,
      ])
      if (previous) {
        queryClient.setQueryData<TransporteData>(['da-transporte', da?.id], {
          ...previous,
          onibus: [
            ...previous.onibus,
            {
              id: `temp-${Date.now()}`,
              nome,
              vagas,
              valorPorPessoa,
              passageiros: [],
            },
          ],
        })
      }
      setNovoOnibusAberto(false)
      setNovoOnibusNome('')
      setNovoOnibusVagas('')
      setNovoOnibusValor('')
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(['da-transporte', da?.id], context.previous)
      toast.error('Erro ao adicionar ônibus.')
    },
    onSuccess: () => toast.success('Ônibus adicionado.'),
    onSettled: () => invalidar(),
  })

  const excluirOnibus = useMutation({
    mutationFn: (id: string) => api.delete(`/da/onibus/${id}`),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['da-transporte', da?.id] })
      const previous = queryClient.getQueryData<TransporteData>([
        'da-transporte',
        da?.id,
      ])
      if (previous) {
        const onibus = previous.onibus.find((o) => o.id === id)
        const passageiros = onibus?.passageiros ?? []
        queryClient.setQueryData<TransporteData>(['da-transporte', da?.id], {
          ...previous,
          onibus: previous.onibus.filter((o) => o.id !== id),
          semVeiculo: [
            ...previous.semVeiculo,
            ...passageiros.map((p) => ({
              idPessoa: p.idPessoa,
              pessoa: p.pessoa,
              comoVai: p.comoVai,
              nomeBP: p.nomeBP,
              conviteMotorista: null,
              pagouOnibus: p.pagouOnibus,
              valorPago: p.valorPago,
            })),
          ],
        })
      }
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous)
        queryClient.setQueryData(['da-transporte', da?.id], context.previous)
      toast.error('Erro ao remover ônibus.')
    },
    onSuccess: () => toast.success('Ônibus removido.'),
    onSettled: () => invalidar(),
  })

  // ── DnD ──────────────────────────────────────────────────────────────────

  function isVehicleFull(
    vehicleId: string,
    excludeId: string,
    snapshot: SortablePessoa[],
  ): boolean {
    if (!transporte || vehicleId === 'sem-veiculo') return false
    const count = snapshot.filter(
      (p) =>
        p.vehicleId === vehicleId &&
        String(p.id) !== excludeId &&
        p.content.comoVai !== 'DIRIGINDO',
    ).length
    if (vehicleId.startsWith('carro-')) {
      const carro = transporte.carros.find((c) => `carro-${c.id}` === vehicleId)
      if (!carro) return false
      const pendentesCount = carro.convitesPendentes.filter(
        (cv) => !snapshot.some((p) => String(p.id) === cv.idPessoa),
      ).length
      return count + pendentesCount >= carro.vagas
    }
    if (vehicleId.startsWith('onibus-')) {
      const onibus = transporte.onibus.find(
        (o) => `onibus-${o.id}` === vehicleId,
      )
      return !!onibus && onibus.vagas !== null && count >= onibus.vagas
    }
    return false
  }

  function onDragStart(event: DragStartEvent) {
    if (paymentPendingRef.current) return
    const data = event.active.data.current as PessoaDragData | undefined
    if (data?.type === 'Pessoa') {
      setActivePessoa(data.pessoa)
      setOriginalVehicleId(data.pessoa.vehicleId)
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return
    const pessoaId = String(active.id)
    const targetId = String(over.id)
    setPessoas((prev) => {
      if (isVehicleFull(targetId, pessoaId, prev)) return prev
      return prev.map((p) =>
        String(p.id) === pessoaId ? { ...p, vehicleId: targetId } : p,
      )
    })
  }

  function onDragCancel() {
    if (activePessoa && originalVehicleId) {
      setPessoas((prev) =>
        prev.map((p) =>
          String(p.id) === String(activePessoa.id)
            ? { ...p, vehicleId: originalVehicleId }
            : p,
        ),
      )
    }
    setActivePessoa(null)
    setOriginalVehicleId(null)
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const pessoaId = String(active.id)
    const prevId = originalVehicleId

    setActivePessoa(null)
    setOriginalVehicleId(null)

    if (!over) {
      setPessoas((prev) =>
        prev.map((p) =>
          String(p.id) === pessoaId
            ? { ...p, vehicleId: prevId ?? 'sem-veiculo' }
            : p,
        ),
      )
      return
    }

    const droppedOnId = String(over.id)
    // Use the optimistic position — onDragOver may have blocked moves to full vehicles
    const effectiveId =
      pessoas.find((p) => String(p.id) === pessoaId)?.vehicleId ??
      prevId ??
      'sem-veiculo'

    if (effectiveId === prevId) {
      // If the user dropped on a different vehicle but it was blocked → show feedback
      if (droppedOnId !== prevId) toast.error('Veículo cheio.')
      return
    }

    mover.mutate({ idPessoa: pessoaId, vehicleId: effectiveId })
  }

  const stats = transporte?.stats

  const buildOnibusCards = (passengerCols: string) =>
    (transporte?.onibus ?? []).map((onibus) => {
      const pessoasOnibus = pessoas.filter(
        (p) => p.vehicleId === `onibus-${onibus.id}`,
      )
      const ocupados = pessoasOnibus.length
      const vagasLivres = onibus.vagas !== null ? onibus.vagas - ocupados : null
      const isCollapsed = collapsed.has(`onibus-${onibus.id}`)
      return (
        <Card
          key={onibus.id}
          className={cn(
            'flex flex-col gap-4 shadow-lg',
            isCollapsed && 'self-start',
          )}
        >
          <CardTitle className="rounded-t-lg bg-purple-500/20">
            <div className="flex items-center justify-between px-4 py-3">
              {editandoOnibus === onibus.id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    placeholder="Nome"
                    value={editOnibusNome}
                    onChange={(e) => setEditOnibusNome(e.target.value)}
                    wrapperClassName="w-36"
                    className="h-7 text-xs"
                  />
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={1}
                      placeholder="0"
                      value={editOnibusVagas}
                      onChange={(e) => setEditOnibusVagas(e.target.value)}
                      wrapperClassName="w-16"
                      className="h-7 text-xs"
                    />
                    <span className="text-xs text-zinc-500">lugares</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">R$</span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0,00"
                      value={editOnibusValor}
                      onChange={(e) => setEditOnibusValor(e.target.value)}
                      wrapperClassName="w-20"
                      className="h-7 text-xs"
                    />
                  </div>
                  <button
                    onClick={() => editarOnibus.mutate(onibus.id)}
                    disabled={
                      editarOnibus.isPending ||
                      !editOnibusNome.trim() ||
                      !Number(editOnibusValor)
                    }
                    className="text-green-600 hover:text-green-700 disabled:opacity-40"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    onClick={() => setEditandoOnibus(null)}
                    className="text-zinc-500 hover:text-zinc-700"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-zinc-700">
                    {onibus.nome}
                    <span className="ml-2 text-sm font-normal text-zinc-400">
                      {onibus.valorPorPessoa.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {ocupados} {ocupados !== 1 ? 'pessoas' : 'pessoa'}
                    {vagasLivres !== null &&
                      ` · ${vagasLivres} livre${vagasLivres !== 1 ? 's' : ''}`}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCollapse(`onibus-${onibus.id}`)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  {isCollapsed ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronUp className="size-4" />
                  )}
                </button>
                {editandoOnibus !== onibus.id && (
                  <button
                    onClick={() => {
                      setEditandoOnibus(onibus.id)
                      setEditOnibusNome(onibus.nome)
                      setEditOnibusVagas(
                        onibus.vagas ? String(onibus.vagas) : '',
                      )
                      setEditOnibusValor(String(onibus.valorPorPessoa))
                    }}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <Pencil className="size-4" />
                  </button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-zinc-400 hover:text-red-500">
                      <Trash2 className="size-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Remover {onibus.nome}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Os passageiros serão desalocados mas continuarão
                        inscritos no DA.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => excluirOnibus.mutate(onibus.id)}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardTitle>
          {!isCollapsed && (
            <CardContent>
              <Droppable id={`onibus-${onibus.id}`} className={passengerCols}>
                {pessoasOnibus.length === 0 && (
                  <div className="col-span-full flex min-h-12 items-center justify-center rounded-lg border border-dashed border-purple-300 bg-purple-50/50 text-sm text-purple-400">
                    Arraste aqui
                  </div>
                )}
                {pessoasOnibus.map((p) => {
                  const divergente =
                    p.content.pagouOnibus &&
                    p.content.valorPago !== null &&
                    p.content.valorPago !== onibus.valorPorPessoa
                  const formatBRL = (v: number) =>
                    v.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                  const isPendente = p.content.pendentePagamento
                  const isBusy =
                    mover.isPending ||
                    togglePagamento.isPending ||
                    corrigirPagamento.isPending
                  return (
                    <CardPessoa
                      key={String(p.id)}
                      pessoa={p}
                      compact
                      actions={
                        divergente ? (
                          <button
                            disabled={isBusy}
                            title={`Pago ${formatBRL(p.content.valorPago!)} — ônibus atual: ${formatBRL(onibus.valorPorPessoa)}. Clique para corrigir.`}
                            onClick={() =>
                              corrigirPagamento.mutate({
                                idPessoa: String(p.id),
                                valorPorOnibus: onibus.valorPorPessoa,
                              })
                            }
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Badge className="w-[5.5rem] cursor-[inherit] justify-center whitespace-nowrap border-amber-300 bg-amber-50 text-xs text-amber-700 hover:bg-amber-100">
                              <span className="flex items-center gap-1">
                                <AlertTriangle className="size-3 shrink-0" />
                                {formatBRL(p.content.valorPago!)}
                              </span>
                            </Badge>
                          </button>
                        ) : isPendente ? (
                          <button
                            disabled={isBusy}
                            title={`Mudou de veículo — confirmar pagamento (${formatBRL(onibus.valorPorPessoa)})`}
                            onClick={() =>
                              togglePagamento.mutate({
                                idPessoa: String(p.id),
                                pagouOnibus: true,
                                valorPorOnibus: onibus.valorPorPessoa,
                              })
                            }
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Badge className="w-[5.5rem] cursor-[inherit] justify-center whitespace-nowrap border-amber-300 bg-amber-50 text-xs text-amber-700 hover:bg-amber-100">
                              <span className="flex items-center gap-1">
                                <AlertTriangle className="size-3 shrink-0" />
                                {formatBRL(onibus.valorPorPessoa)}
                              </span>
                            </Badge>
                          </button>
                        ) : (
                          <button
                            disabled={isBusy}
                            onClick={() =>
                              togglePagamento.mutate({
                                idPessoa: String(p.id),
                                pagouOnibus: !p.content.pagouOnibus,
                                valorPorOnibus: onibus.valorPorPessoa,
                              })
                            }
                            title={
                              p.content.pagouOnibus
                                ? 'Marcar como não pago'
                                : `Marcar como pago (${formatBRL(onibus.valorPorPessoa)})`
                            }
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Badge
                              className={cn(
                                'w-[5.5rem] cursor-[inherit] justify-center whitespace-nowrap text-xs',
                                p.content.pagouOnibus
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
                              )}
                            >
                              <span className="flex items-center gap-1">
                                {p.content.pagouOnibus ? (
                                  <>
                                    <Check className="size-3" />
                                    {formatBRL(onibus.valorPorPessoa)}
                                  </>
                                ) : (
                                  <>
                                    <X className="size-3" /> Não pago
                                  </>
                                )}
                              </span>
                            </Badge>
                          </button>
                        )
                      }
                    />
                  )
                })}
              </Droppable>
            </CardContent>
          )}
        </Card>
      )
    })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-tertiary text-2xl font-bold">Transporte</h1>
          <span className="text-base font-normal text-zinc-500">
            Gerencie os veículos e a alocação dos participantes
          </span>
        </div>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
          {isLoading && (
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 flex-1 rounded-xl" />
              ))}
            </div>
          )}
          {!isLoading && stats && (
            <>
              <div className="flex gap-2">
                {((da?.organizarTransporte ?? true)
                  ? [
                      {
                        label: 'Total',
                        value: stats.total,
                        cls: 'text-zinc-600',
                      },
                      {
                        label: 'Dirigindo',
                        value: stats.dirigindo,
                        cls: 'text-blue-600',
                      },
                      {
                        label: 'Carona',
                        value: stats.carona,
                        cls: 'text-orange-600',
                      },
                      {
                        label: 'Ônibus',
                        value: stats.onibus,
                        cls: 'text-purple-600',
                      },
                      {
                        label: 'Sem transporte',
                        shortLabel: 'Sem',
                        value: stats.semTransporte,
                        cls: 'text-zinc-400',
                      },
                    ]
                  : [
                      {
                        label: 'Total',
                        value: stats.total,
                        cls: 'text-zinc-600',
                      },
                      {
                        label: 'Carro',
                        value: stats.dirigindo + stats.carona,
                        cls: 'text-blue-600',
                      },
                      {
                        label: 'Ônibus',
                        value: stats.onibus,
                        cls: 'text-purple-600',
                      },
                      {
                        label: 'Sem transporte',
                        shortLabel: 'Sem',
                        value: stats.semTransporte,
                        cls: 'text-zinc-400',
                      },
                    ]
                ).map(({ label, shortLabel, value, cls }) => (
                  <div
                    key={label}
                    className="flex flex-1 flex-col items-center rounded-xl bg-white px-2.5 py-1.5 shadow-sm"
                  >
                    <span className={`text-lg font-bold ${cls}`}>{value}</span>
                    <span className="text-center text-[11px] text-nowrap text-zinc-400">
                      <span className="hidden lg:inline">{label}</span>
                      <span className="lg:hidden">{shortLabel ?? label}</span>
                    </span>
                  </div>
                ))}
              </div>
              {da && (
                <>
                  <div className="hidden h-8 w-px bg-zinc-200 sm:block" />
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => setNovoOnibusAberto(true)}
                  >
                    <Plus className="mr-1 size-4" />
                    <Bus className="mr-1 size-4" />
                    Ônibus/van
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {!isLoading && !da && (
        <p className="text-sm text-zinc-500">Nenhum DA criado ainda.</p>
      )}

      {!isLoading && da && transporte && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <div className="space-y-4">
            {/* ÔNIBUS — full width, topo (só quando organizarTransporte) */}
            {da.organizarTransporte && transporte.onibus.length > 0 && (
              <div className="space-y-4">
                {buildOnibusCards(
                  'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
                )}
              </div>
            )}

            {/* CARROS + SEM VEÍCULO — 3 colunas: carros nas 2 primeiras, sem veículo na 3ª */}
            {transporte.carros.length === 0 &&
              transporte.onibus.length === 0 && (
                <p className="text-sm text-zinc-400">
                  Nenhum veículo cadastrado.
                </p>
              )}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div
                className={`grid grid-cols-1 gap-4 lg:col-span-2 ${da.organizarTransporte ? 'lg:grid-cols-2' : ''}`}
              >
                {da.organizarTransporte
                  ? transporte.carros.map((carro) => {
                      const pessoasCarro = pessoas.filter(
                        (p) => p.vehicleId === `carro-${carro.id}`,
                      )
                      const pessoasCarroInscritas = pessoasCarro.filter(
                        (p) => p.content.comoVai !== 'DIRIGINDO',
                      )
                      const convitesPendentesVisiveis =
                        carro.convitesPendentes.filter(
                          (cv) =>
                            !pessoas.some((p) => String(p.id) === cv.idPessoa),
                        )
                      const motoristaPassageiro = carro.passageiros.find(
                        (p) => p.comoVai === 'DIRIGINDO',
                      )
                      const motoristaPendente = !carro.passageiros.some(
                        (p) => p.comoVai === 'DIRIGINDO',
                      )
                      const editando = editandoCarro === carro.id
                      const titulo =
                        [carro.modelo, carro.placa]
                          .filter(Boolean)
                          .join(' · ') || 'Sem identificação'
                      const vagasOcupadas =
                        pessoasCarro.filter(
                          (p) => p.content.comoVai !== 'DIRIGINDO',
                        ).length + convitesPendentesVisiveis.length
                      const vagasLivres = Math.max(
                        0,
                        carro.vagas - vagasOcupadas,
                      )

                      const isCollapsed = collapsed.has(`carro-${carro.id}`)

                      return (
                        <Card
                          key={carro.id}
                          className="flex flex-col gap-4 self-start shadow-lg"
                        >
                          {/* Header like Circulo */}
                          <CardTitle className="rounded-t-lg bg-blue-500/20">
                            <div className="flex items-center justify-between px-4 py-3">
                              {editando ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  <Input
                                    placeholder="Modelo"
                                    value={editCarroModelo}
                                    onChange={(e) =>
                                      setEditCarroModelo(e.target.value)
                                    }
                                    wrapperClassName="w-24"
                                    className="h-7 text-xs"
                                  />
                                  <Input
                                    placeholder="Placa"
                                    value={editCarroPlaca}
                                    onChange={(e) =>
                                      setEditCarroPlaca(
                                        e.target.value.toUpperCase(),
                                      )
                                    }
                                    wrapperClassName="w-24"
                                    className="h-7 text-xs"
                                  />
                                  <Input
                                    type="number"
                                    min={1}
                                    value={editCarroVagas}
                                    onChange={(e) =>
                                      setEditCarroVagas(e.target.value)
                                    }
                                    wrapperClassName="w-14"
                                    className="h-7 text-xs"
                                  />
                                  <button
                                    onClick={() => editarCarro.mutate(carro.id)}
                                    disabled={editarCarro.isPending}
                                    className="text-green-600 hover:text-green-700 disabled:opacity-40"
                                  >
                                    <Check className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditandoCarro(null)}
                                    className="text-zinc-500 hover:text-zinc-700"
                                  >
                                    <X className="size-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <h2 className="text-xl font-bold text-zinc-700">
                                      {titulo}
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                      {vagasLivres} livre
                                      {vagasLivres !== 1 ? 's' : ''}
                                      {isCollapsed &&
                                        ` · ${nomePessoa(carro.motorista)}`}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        toggleCollapse(`carro-${carro.id}`)
                                      }
                                      className="text-zinc-400 hover:text-zinc-600"
                                    >
                                      {isCollapsed ? (
                                        <ChevronDown className="size-4" />
                                      ) : (
                                        <ChevronUp className="size-4" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditandoCarro(carro.id)
                                        setEditCarroModelo(carro.modelo ?? '')
                                        setEditCarroPlaca(carro.placa ?? '')
                                        setEditCarroVagas(String(carro.vagas))
                                      }}
                                      className="text-zinc-400 hover:text-zinc-600"
                                    >
                                      <Pencil className="size-4" />
                                    </button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <button className="text-zinc-400 hover:text-red-500">
                                          <Trash2 className="size-4" />
                                        </button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Remover este carro?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Os passageiros serão desalocados mas
                                            continuarão inscritos no DA.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancelar
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              excluirCarro.mutate(carro.id)
                                            }
                                          >
                                            Remover
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardTitle>

                          {!isCollapsed && (
                            <CardContent>
                              {/* Motorista — like TioCirculo */}
                              <MotoristaSection
                                motorista={carro.motorista}
                                nomeBP={motoristaPassageiro?.nomeBP ?? null}
                                pendente={motoristaPendente}
                              />

                              {/* Passageiros */}
                              <div className="mt-4 flex flex-col gap-2">
                                <Droppable
                                  id={`carro-${carro.id}`}
                                  className="flex flex-col gap-2"
                                >
                                  {pessoasCarroInscritas.length === 0 &&
                                    (motoristaPendente ? (
                                      <div className="flex min-h-12 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-400">
                                        Aguardando confirmação do motorista
                                      </div>
                                    ) : (
                                      <div className="flex min-h-12 items-center justify-center rounded-lg border border-dashed border-blue-300 bg-blue-50/50 text-sm text-blue-400">
                                        Arraste aqui
                                      </div>
                                    ))}
                                  {pessoasCarroInscritas.map((p) => (
                                    <CardPessoa
                                      key={String(p.id)}
                                      pessoa={p}
                                      compact
                                      actions={
                                        p.content.conviteStatus === 'ACEITO' ? (
                                          <Check className="size-3 text-emerald-500" />
                                        ) : undefined
                                      }
                                    />
                                  ))}
                                </Droppable>

                                {convitesPendentesVisiveis.length > 0 && (
                                  <div className="mt-1 space-y-1 border-t border-zinc-100 pt-2">
                                    {convitesPendentesVisiveis.map((cv) => (
                                      <div
                                        key={cv.idPessoa}
                                        className="flex items-center gap-2 px-1 py-0.5"
                                      >
                                        <Avatar className="size-6 shrink-0">
                                          <AvatarImage
                                            src={
                                              cv.pessoa.avatarUrl ?? undefined
                                            }
                                          />
                                          <AvatarFallback className="text-[10px]">
                                            {cv.pessoa.nome.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">
                                          {nomePessoa(cv.pessoa)}
                                        </span>
                                        <Clock className="size-3.5 shrink-0 text-amber-400" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })
                  : buildOnibusCards(
                      'grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4',
                    )}
              </div>

              {/* SEM VEÍCULO — last coluna */}
              <Card className="flex flex-col gap-4 shadow-lg lg:col-start-3">
                <CardTitle className="rounded-t-lg bg-zinc-200/60">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-700">
                        Sem veículo
                      </h2>
                      <p className="text-sm text-zinc-500">
                        {
                          pessoas.filter((p) => p.vehicleId === 'sem-veiculo')
                            .length
                        }{' '}
                        pessoa
                        {pessoas.filter((p) => p.vehicleId === 'sem-veiculo')
                          .length !== 1
                          ? 's'
                          : ''}
                      </p>
                    </div>
                  </div>
                </CardTitle>
                <CardContent className="flex flex-1 flex-col">
                  <Droppable
                    id="sem-veiculo"
                    className="flex flex-1 flex-col gap-4"
                  >
                    {pessoas.filter((p) => p.vehicleId === 'sem-veiculo')
                      .length === 0 && (
                      <div className="flex flex-1 items-center justify-center">
                        <p className="text-center text-sm text-zinc-400">
                          Todos encontreiros alocados
                        </p>
                      </div>
                    )}
                    {pessoas
                      .filter((p) => p.vehicleId === 'sem-veiculo')
                      .map((p) => {
                        const formatBRL = (v: number) =>
                          v.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        return (
                        <CardPessoa
                          key={String(p.id)}
                          pessoa={p}
                          actions={
                            <div className="flex items-center gap-1">
                              {p.content.pagouOnibus && p.content.valorPago !== null && (
                                <button
                                  title={`Pagou ${formatBRL(p.content.valorPago)} — clique para confirmar devolução`}
                                  disabled={devolverPagamento.isPending}
                                  onClick={() =>
                                    devolverPagamento.mutate({
                                      idPessoa: String(p.id),
                                    })
                                  }
                                  className="disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Badge className="cursor-pointer justify-center whitespace-nowrap border-amber-300 bg-amber-50 text-[10px] text-amber-700 hover:bg-amber-100">
                                    <span className="flex items-center gap-1">
                                      <Banknote className="size-3 shrink-0" />
                                      Já pago
                                    </span>
                                  </Badge>
                                </button>
                              )}
                              <button
                                title="Converter em motorista"
                                className="text-zinc-400 hover:text-blue-500"
                                onClick={async () => {
                                  const { data } = await api.get(
                                    `/da/carro-anterior?idPessoa=${String(p.id)}`,
                                  )
                                  setMotoristaModelo(data?.modeloCarro ?? '')
                                  setMotoristaPlaca(data?.placaCarro ?? '')
                                  setMotoristaVagas(
                                    data ? String(data.lugaresCarro - 1) : '4',
                                  )
                                  setConvertendoMotorista({
                                    idPessoa: String(p.id),
                                    nome: p.content.nome,
                                  })
                                }}
                              >
                                <Car className="size-3.5" />
                              </button>
                            </div>
                          }
                        />
                        )
                      })}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          </div>

          <DragOverlay>
            {activePessoa && <CardPessoa pessoa={activePessoa} isOverlay />}
          </DragOverlay>
        </DndContext>
      )}

      {/* Dialog: novo ônibus */}
      {/* Dialog: converter em motorista */}
      <Dialog
        open={!!convertendoMotorista}
        onOpenChange={(open) => !open && setConvertendoMotorista(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Converter {convertendoMotorista?.nome} em motorista
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-zinc-600">Modelo</label>
              <Input
                placeholder="Ex: Gol, HB20"
                value={motoristaModelo}
                onChange={(e) => setMotoristaModelo(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-600">Placa</label>
              <Input
                placeholder="ABC-1234"
                value={motoristaPlaca}
                onChange={(e) =>
                  setMotoristaPlaca(e.target.value.toUpperCase())
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-600">
                Vagas para passageiros
              </label>
              <Input
                type="number"
                min={1}
                value={motoristaVagas}
                onChange={(e) => setMotoristaVagas(e.target.value)}
                wrapperClassName="w-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConvertendoMotorista(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                converterEmMotorista.mutate(convertendoMotorista!.idPessoa)
              }
              disabled={
                !Number(motoristaVagas) || converterEmMotorista.isPending
              }
            >
              {converterEmMotorista.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={novoOnibusAberto} onOpenChange={setNovoOnibusAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar ônibus ou van</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-zinc-600">Nome</label>
              <Input
                placeholder="Ex: Van EJC, Ônibus Municipal"
                value={novoOnibusNome}
                onChange={(e) => setNovoOnibusNome(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-600">Vagas</label>
              <Input
                type="number"
                min={1}
                placeholder="Ex: 15"
                value={novoOnibusVagas}
                onChange={(e) => setNovoOnibusVagas(e.target.value)}
                wrapperClassName="w-32"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-600">
                Valor por pessoa (R$)
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="Ex: 25,00"
                value={novoOnibusValor}
                onChange={(e) => setNovoOnibusValor(e.target.value)}
                wrapperClassName="w-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNovoOnibusAberto(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                criarOnibus.mutate({
                  nome: novoOnibusNome,
                  vagas: Number(novoOnibusVagas) || null,
                  valorPorPessoa: Number(novoOnibusValor),
                })
              }
              disabled={
                !novoOnibusNome.trim() ||
                !Number(novoOnibusValor) ||
                criarOnibus.isPending
              }
            >
              {criarOnibus.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
