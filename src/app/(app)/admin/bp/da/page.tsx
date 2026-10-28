'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CalendarClock,
  Check,
  ClipboardList,
  Loader2,
  Lock,
  LockOpen,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { api } from '@/lib/axios'

import { DAGestaoSkeleton } from './DAGestaoSkeleton'
import { RichTextEditor } from './RichTextEditor'

interface DiaAmizade {
  id: string
  idEncontro: string
  mensagemInicial: string | null
  dataDA: string | null
  aberto: boolean
  organizarTransporte: boolean
  inscricoes: { idItem: string; createdAt: string }[]
}

interface DAResponse {
  encontro: { id: string; numeroEncontro: number }
  da: DiaAmizade | null
  mensagemAnterior: string | null
}

export default function DABPPage() {
  const queryClient = useQueryClient()

  const [mensagem, setMensagem] = useState('')
  const [mensagemSalva, setMensagemSalva] = useState('')
  const [dataInput, setDataInput] = useState('')
  const [dataSalva, setDataSalva] = useState('')

  const { data, isLoading } = useQuery<DAResponse>({
    queryKey: ['da'],
    queryFn: async () => (await api.get('/da')).data,
  })

  useEffect(() => {
    if (data) {
      const texto = data.da?.mensagemInicial ?? data.mensagemAnterior ?? ''
      setMensagem(texto)
      setMensagemSalva(data.da?.mensagemInicial ?? '')
      const dataStr = data.da?.dataDA
        ? new Date(data.da.dataDA).toISOString().slice(0, 10)
        : ''
      setDataInput(dataStr)
      setDataSalva(dataStr)
    }
  }, [data])

  const encontro = data?.encontro
  const da = data?.da
  const mensagemAlterada = mensagem !== mensagemSalva
  const dataAlterada = dataInput !== dataSalva

  const criarDA = useMutation({
    mutationFn: () => api.post('/da'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da'] })
      toast.success('DA criado com sucesso!')
    },
    onError: () => toast.error('Erro ao criar o DA.'),
  })

  const toggleStatus = useMutation({
    mutationFn: (aberto: boolean) =>
      api.patch('/da/status', { idDA: da!.id, aberto }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['da'] }),
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao alterar o status do DA.',
      ),
  })

  const salvarMensagem = useMutation({
    mutationFn: () =>
      api.patch('/da/mensagem', { idDA: da!.id, mensagemInicial: mensagem }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da'] })
      setMensagemSalva(mensagem)
      toast.success('Mensagem salva.')
    },
    onError: () => toast.error('Erro ao salvar a mensagem.'),
  })

  const toggleOrganizarTransporte = useMutation({
    mutationFn: (organizarTransporte: boolean) =>
      api.patch('/da/organizar-transporte', { idDA: da!.id, organizarTransporte }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['da'] }),
    onError: () => toast.error('Erro ao alterar a configuração de transporte.'),
  })

  const salvarData = useMutation({
    mutationFn: () =>
      api.patch('/da/data', {
        idDA: da!.id,
        dataDA: dataInput || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da'] })
      setDataSalva(dataInput)
      toast.success('Data salva.')
    },
    onError: () => toast.error('Erro ao salvar a data.'),
  })

  const dataFormatada = da?.dataDA
    ? new Date(da.dataDA).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-tertiary text-2xl font-bold">
            {encontro && dataFormatada
              ? `${encontro.numeroEncontro}º Dia da Amizade · ${dataFormatada}`
              : 'Dia da Amizade'}
          </h1>
          <span className="text-sm text-zinc-500">
            Configure as informações e controle a abertura do formulário
          </span>
        </div>
        <Link href="/admin/da" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <ClipboardList className="mr-1.5 h-4 w-4" />
            Formulário do encontreiro
          </Button>
        </Link>
      </div>

      {isLoading && <DAGestaoSkeleton />}

      {!isLoading && !da && (
        <div className="pt-2">
          <Button onClick={() => criarDA.mutate()} disabled={criarDA.isPending}>
            {criarDA.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            {encontro
              ? `Criar DA do ${encontro.numeroEncontro}º EJC`
              : 'Criar DA'}
          </Button>
        </div>
      )}

      {!isLoading && da && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Status do formulário</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Switch
                  checked={da.aberto}
                  onCheckedChange={(v) => toggleStatus.mutate(v)}
                  disabled={toggleStatus.isPending}
                />
                <Badge
                  className={
                    da.aberto
                      ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15'
                      : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }
                >
                  {da.aberto ? (
                    <span className="flex items-center gap-1.5">
                      <LockOpen className="size-3" /> Aberto
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Lock className="size-3" /> Fechado
                    </span>
                  )}
                </Badge>
                {!da.aberto && (
                  <p className="text-xs text-zinc-400">
                    Precisa de data, mensagem e pelo menos 1 item para abrir.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Organizar transporte */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organização de transporte</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Switch
                  checked={da.organizarTransporte}
                  onCheckedChange={(v) => toggleOrganizarTransporte.mutate(v)}
                  disabled={toggleOrganizarTransporte.isPending}
                />
                <div>
                  <p className="text-sm font-medium text-zinc-700">
                    {da.organizarTransporte ? 'Ativo' : 'Inativo'}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {da.organizarTransporte
                      ? 'BPs veem carros, motoristas e caronas na aba de transporte.'
                      : 'BPs veem apenas ônibus e sem veículo. Carros ficam ocultos.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Data do DA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 shrink-0 text-zinc-400" />
                <Input
                  type="date"
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  className="w-48"
                />
              </div>
              {dataAlterada && (
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => salvarData.mutate()}
                    disabled={salvarData.isPending}
                  >
                    {salvarData.isPending ? (
                      <Loader2 className="mr-1 size-4 animate-spin" />
                    ) : (
                      <Check className="mr-1 size-4" />
                    )}
                    Salvar data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mensagem inicial */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mensagem inicial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RichTextEditor
                value={mensagem}
                onChange={setMensagem}
                placeholder="Escreva a mensagem de boas-vindas para o DA..."
              />
              {mensagemAlterada && (
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => salvarMensagem.mutate()}
                    disabled={salvarMensagem.isPending}
                  >
                    {salvarMensagem.isPending ? (
                      <Loader2 className="mr-1 size-4 animate-spin" />
                    ) : (
                      <Check className="mr-1 size-4" />
                    )}
                    Salvar mensagem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
