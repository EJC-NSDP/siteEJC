'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Beef,
  Bus,
  Car,
  Check,
  ChevronLeft,
  Clock,
  Infinity as InfinityIcon,
  Lock,
  MessageCircle,
  Users,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  PessoaSearchInput,
  type PessoaSelecionada,
} from '@/components/DA/PessoaSearchInput'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { hasRole } from '@/lib/auth/permissions'
import { api } from '@/lib/axios'

type ComoVai = 'DIRIGINDO' | 'CARONA' | 'ONIBUS'

interface ItemDA {
  id: string
  nome: string
  categoria: 'CARNE' | 'SOBREMESA' | 'ACOMPANHAMENTO' | 'VEGETARIANA'
  quantidade: number | null
  pessoasPorUnidade: number | null
  _count: { inscricoes: number }
}

interface ConvitePessoa {
  id: string
  nome: string
  sobrenome: string
  apelido: string | null
  avatarUrl: string | null
}

interface ConviteVeiculoInfo {
  id: string
  status: 'PENDENTE' | 'ACEITO' | 'RECUSADO'
  iniciador: 'MOTORISTA' | 'CARONA' | 'DONO'
  idCarroDA: string | null
  convidado?: ConvitePessoa
  motorista?: ConvitePessoa
  carroDa?: {
    id: string
    modelo: string | null
    placa: string | null
    vagas: number
  } | null
}

interface GrupoCarnePessoa {
  id: string
  nome: string
  sobrenome: string
  apelido: string | null
  avatarUrl: string | null
}

interface GrupoCarneInfo {
  id: string
  capacidade: number
  membros: { pessoa: GrupoCarnePessoa }[]
  convites: {
    id: string
    status: 'PENDENTE' | 'ACEITO' | 'RECUSADO'
    convidado: GrupoCarnePessoa
  }[]
}

interface ConviteCarneInfo {
  id: string
  status: 'PENDENTE' | 'ACEITO' | 'RECUSADO'
  grupoCarne: {
    id: string
    idItem: string
    capacidade: number
    itemDA: {
      item: {
        nome: string
        categoria: 'CARNE' | 'SOBREMESA' | 'ACOMPANHAMENTO' | 'VEGETARIANA'
      }
    }
    membros: {
      pessoa: {
        id: string
        nome: string
        sobrenome: string
        apelido: string | null
        avatarUrl: string | null
      }
    }[]
  }
}

interface InscricaoAtual {
  idItem: string | null
  createdAt: string
  comoVai: ComoVai | null
  descricaoItem: string | null
  observacao: string | null
  idGrupoCarne: string | null
  carroDa: {
    modelo: string | null
    placa: string | null
    vagas: number
    motorista: GrupoCarnePessoa
    passageiros: { pessoa: GrupoCarnePessoa }[]
  } | null
  onibusDA: { nome: string } | null
  grupoCarne: GrupoCarneInfo | null
}

interface DiaAmizade {
  id: string
  mensagemInicial: string | null
  dataDA: string | null
  aberto: boolean
  itens: ItemDA[]
  inscricoes: InscricaoAtual[]
}

interface CarroAnterior {
  id: string
  modeloCarro: string
  placaCarro: string
  lugaresCarro: number
}

interface PessoaInfo {
  nome: string
  sobrenome: string
  celular: string
  apelido: string | null
}

interface DAResponse {
  encontro: { id: string; numeroEncontro: number }
  da: DiaAmizade | null
  carroAnterior: CarroAnterior | null
  pessoa: PessoaInfo | null
  convitesVeiculo: ConviteVeiculoInfo[]
  convitesMotorista: ConviteVeiculoInfo[]
  convitesCarne: ConviteCarneInfo[]
  convitesEnviados: ConviteVeiculoInfo[]
}

export default function DAEncontreiroPage() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const isAdmin = hasRole(session?.user?.roles ?? [], 'ADMIN')
  const isBP = hasRole(session?.user?.roles ?? [], 'BP')
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [comoVai, setComoVai] = useState<ComoVai | null>(null)
  const [itemSelecionado, setItemSelecionado] = useState<string | null>(null)
  const [descricaoItem, setDescricaoItem] = useState('')
  const [observacao, setObservacao] = useState('')

  // pessoa fields
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [celular, setCelular] = useState('')
  const [apelido, setApelido] = useState('')

  // Car form state
  const [usarCarroAnterior, setUsarCarroAnterior] = useState<boolean | null>(
    null,
  )
  const [carroModelo, setCarroModelo] = useState('')
  const [carroPlaca, setCarroPlaca] = useState('')
  const [carroVagas, setCarroVagas] = useState('3')
  const [convidados, setConvidados] = useState<(PessoaSelecionada | null)[]>([])
  const [aceitarConviteVeiculoId, setAceitarConviteVeiculoId] = useState<
    string | null
  >(null)
  const [motoristaSelecionado, setMotoristaSelecionado] =
    useState<PessoaSelecionada | null>(null)
  const [avisoMotoristaInscrito, setAvisoMotoristaInscrito] = useState<
    string | null
  >(null)
  const [conviteVeiculoRejeitados, setConviteVeiculoRejeitados] = useState<
    string[]
  >([])
  const [conviteMotoristaAceitos, setConviteMotoristaAceitos] = useState<
    string[]
  >([])
  const [conviteMotoristaRecusados, setConviteMotoristaRecusados] = useState<
    string[]
  >([])
  const [aceitarConviteCarneId, setAceitarConviteCarneId] = useState<
    string | null
  >(null)
  const [convidadosCarne, setConvidadosCarne] = useState<
    (PessoaSelecionada | null)[]
  >([])
  const [conviteCarneRejeitados, setConviteCarneRejeitados] = useState<
    string[]
  >([])

  const { data, isLoading } = useQuery<DAResponse>({
    queryKey: ['da'],
    queryFn: async () => (await api.get('/da')).data,
  })

  const updatePessoa = useMutation({
    mutationFn: () =>
      api.patch('/da/pessoa', {
        nome,
        sobrenome,
        celular,
        apelido: apelido || null,
      }),
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao salvar dados.',
      ),
  })

  const criarCarro = useMutation({
    mutationFn: ({
      idDA,
      excludeConvidadoIds = [],
    }: {
      idDA: string
      excludeConvidadoIds?: string[]
    }) =>
      api
        .post('/da/carros', {
          idDA,
          modelo: carroModelo || undefined,
          placa: carroPlaca || undefined,
          vagas: Number(carroVagas) || 3,
          convidados: convidados
            .filter((c): c is PessoaSelecionada => c !== null)
            .filter((c) => !excludeConvidadoIds.includes(c.idPessoa))
            .slice(0, Number(carroVagas) || 3)
            .map((c) => c.idPessoa),
        })
        .then((r) => r.data as { id: string }),
  })

  const criarConviteVeiculo = useMutation({
    mutationFn: ({
      idDA,
      idMotorista,
      force,
    }: {
      idDA: string
      idMotorista: string
      force?: boolean
    }) => api.post('/da/convites/veiculo', { idDA, idMotorista, force }),
  })

  const responderConviteVeiculo = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'ACEITO' | 'RECUSADO'
    }) => api.patch(`/da/convites/veiculo/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['da'] }),
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao responder convite.',
      ),
  })

  const responderConviteCarne = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.patch(`/da/convites/carne/${id}`, { status: 'RECUSADO' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['da'] }),
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao recusar convite.',
      ),
  })

  const inscrever = useMutation({
    mutationFn: async ({
      idDA,
      idCarroDA,
      aceitarConviteVeiculoId: aceitarVeiculoId,
      aceitarConviteCarneId: aceitarCarneId,
      convidadosCarne: convidadosCarneIds,
    }: {
      idDA: string
      idCarroDA?: string
      aceitarConviteVeiculoId?: string
      aceitarConviteCarneId?: string
      convidadosCarne?: string[]
    }) =>
      api.post('/da/inscricao', {
        idDA,
        idItem: itemSelecionado,
        comoVai,
        idCarroDA: idCarroDA ?? null,
        descricaoItem: descricaoItem || null,
        observacao: observacao.trim() || null,
        aceitarConviteVeiculoId: aceitarVeiculoId ?? undefined,
        aceitarConviteCarneId: aceitarCarneId ?? undefined,
        convidadosCarne: convidadosCarneIds ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['da'] })
      toast.success('Inscrição confirmada! Até o DA 🎉')
    },
    onError: (err: unknown) =>
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? 'Erro ao confirmar inscrição.',
      ),
  })

  const da = data?.da
  const encontro = data?.encontro
  const carroAnterior = data?.carroAnterior ?? null
  const jaInscrito = (da?.inscricoes.length ?? 0) > 0
  const inscricaoAtual = da?.inscricoes[0]

  // Initialize pessoa fields once when data loads
  useEffect(() => {
    if (data?.pessoa) {
      setNome(data.pessoa.nome)
      setSobrenome(data.pessoa.sobrenome)
      setCelular(data.pessoa.celular)
      setApelido(data.pessoa.apelido ?? '')
    }
  }, [data?.pessoa])

  async function handleConfirmarPessoa() {
    await updatePessoa.mutateAsync()
    setStep(3)
  }

  const carneIds = convidadosCarne
    .filter((c): c is PessoaSelecionada => c !== null)
    .map((c) => c.idPessoa)

  async function handleConfirmar() {
    if (!da) return
    if (comoVai === 'DIRIGINDO') {
      const acceptedCaronaIds = conviteMotoristaAceitos
        .map(
          (id) =>
            data?.convitesMotorista.find((c) => c.id === id)?.convidado?.id,
        )
        .filter((id): id is string => !!id)
      const carro = await criarCarro.mutateAsync({
        idDA: da.id,
        excludeConvidadoIds: acceptedCaronaIds,
      })
      for (const conviteId of conviteMotoristaAceitos) {
        await responderConviteVeiculo.mutateAsync({
          id: conviteId,
          status: 'ACEITO',
        })
      }
      await inscrever.mutateAsync({
        idDA: da.id,
        idCarroDA: carro.id,
        aceitarConviteCarneId: aceitarConviteCarneId ?? undefined,
        convidadosCarne: carneIds.length > 0 ? carneIds : undefined,
      })
    } else {
      await inscrever.mutateAsync({
        idDA: da.id,
        aceitarConviteVeiculoId:
          comoVai === 'CARONA'
            ? (aceitarConviteVeiculoId ?? undefined)
            : undefined,
        aceitarConviteCarneId: aceitarConviteCarneId ?? undefined,
        convidadosCarne: carneIds.length > 0 ? carneIds : undefined,
      })
    }
    for (const conviteId of conviteVeiculoRejeitados) {
      await responderConviteVeiculo.mutateAsync({
        id: conviteId,
        status: 'RECUSADO',
      })
    }
    for (const conviteId of conviteMotoristaRecusados) {
      await responderConviteVeiculo.mutateAsync({
        id: conviteId,
        status: 'RECUSADO',
      })
    }
    for (const conviteId of conviteCarneRejeitados) {
      await responderConviteCarne.mutateAsync({ id: conviteId })
    }
  }

  function handleComoVaiSelect(opcao: ComoVai) {
    setComoVai(opcao)
    if (opcao !== 'CARONA') {
      if (aceitarConviteVeiculoId) {
        setConviteVeiculoRejeitados((prev) => [
          ...prev.filter((id) => id !== aceitarConviteVeiculoId),
          aceitarConviteVeiculoId,
        ])
      }
      setAceitarConviteVeiculoId(null)
      setMotoristaSelecionado(null)
    }
    if (opcao === 'DIRIGINDO' && carroAnterior) {
      setUsarCarroAnterior(null) // will ask
    } else if (opcao === 'DIRIGINDO') {
      setUsarCarroAnterior(false)
    }
  }

  async function handleContinuarStep3() {
    if (!da || !comoVai) return
    if (
      comoVai === 'CARONA' &&
      motoristaSelecionado &&
      !aceitarConviteVeiculoId
    ) {
      try {
        await criarConviteVeiculo.mutateAsync({
          idDA: da.id,
          idMotorista: motoristaSelecionado.idPessoa,
        })
      } catch (err: unknown) {
        const errData = (
          err as { response?: { data?: { error?: string; mensagem?: string } } }
        )?.response?.data
        if (errData?.error === 'MOTORISTA_JA_INSCRITO') {
          setAvisoMotoristaInscrito(
            errData.mensagem ??
              `${motoristaSelecionado.nome} já está inscrito no DA.`,
          )
          return
        }
        if (errData?.error !== 'CONVITE_DUPLICADO') {
          toast.error(
            errData?.mensagem ?? errData?.error ?? 'Erro ao enviar convite.',
          )
          return
        }
        // convite já existe — segue para o próximo passo normalmente
      }
    }
    setStep(5)
  }

  const carroFormPreenchido =
    comoVai !== 'DIRIGINDO' ||
    (usarCarroAnterior === true && carroAnterior !== null) ||
    (usarCarroAnterior === false && Number(carroVagas) >= 1)

  function renderCard() {
    if (isLoading) {
      return (
        <Card className="w-full items-center justify-center px-3 pt-8 text-center text-zinc-700">
          <CardContent className="flex w-full flex-col gap-4">
            <p className="text-xl font-bold">Bem-vindo(a)!</p>
            <Button disabled>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl font-normal text-nowrap">
                  Carregando...
                </span>
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="fill-primary/50 inline h-8 w-8 animate-spin text-zinc-100"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (!da) {
      return (
        <Card className="w-full px-3 py-8 text-center text-zinc-700">
          <CardContent className="flex flex-col items-center gap-3">
            <p className="text-lg font-semibold">Ainda não há DA</p>
            <p className="text-sm text-zinc-500">
              O DA do {encontro?.numeroEncontro}º EJC ainda não foi criado pelos
              BPs.
            </p>
          </CardContent>
        </Card>
      )
    }

    if (jaInscrito && inscricaoAtual) {
      const itemDaInscricao = da.itens.find(
        (i) => i.id === inscricaoAtual.idItem,
      )

      const transporteConfig: Record<
        ComoVai,
        {
          label: string
          icon: React.ElementType
          iconBg: string
          iconColor: string
          detalhe: string | null
        }
      > = {
        DIRIGINDO: {
          label: 'Dirigindo',
          icon: Car,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          detalhe: inscricaoAtual.carroDa
            ? [
                inscricaoAtual.carroDa.modelo,
                inscricaoAtual.carroDa.placa,
                `${inscricaoAtual.carroDa.vagas} vagas`,
              ]
                .filter(Boolean)
                .join(' · ')
            : null,
        },
        CARONA: {
          label: 'De carona',
          icon: Users,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          detalhe: null,
        },
        ONIBUS: {
          label: 'De ônibus/van',
          icon: Bus,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          detalhe: inscricaoAtual.onibusDA?.nome ?? null,
        },
      }

      const transporteCfg = inscricaoAtual.comoVai
        ? transporteConfig[inscricaoAtual.comoVai]
        : null

      return (
        <Card className="w-full px-3 py-8 text-center text-zinc-700">
          <CardContent className="flex flex-col items-center gap-5">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
              <Check className="size-6 text-green-600" />
            </div>
            <p className="text-lg font-semibold">Você já está inscrito!</p>

            <div className="flex w-full flex-col gap-3">
              {/* Card: O que vai levar + Grupo de carne */}
              <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <Beef className="size-4 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                      O que vai levar
                    </p>
                    <p className="text-sm font-semibold text-zinc-700">
                      {inscricaoAtual.descricaoItem ??
                        itemDaInscricao?.nome ??
                        '—'}
                    </p>
                    {inscricaoAtual.descricaoItem && (
                      <p className="text-xs text-zinc-400">
                        {itemDaInscricao?.nome}
                      </p>
                    )}
                  </div>
                </div>

                {inscricaoAtual.grupoCarne && (
                  <>
                    <div className="my-3 border-t border-zinc-200" />
                    <p className="mb-2 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                      Grupo de carne
                    </p>
                    <div className="space-y-2">
                      {inscricaoAtual.grupoCarne.membros.map((m) => {
                        const nomeMembro = `${m.pessoa.nome} ${m.pessoa.sobrenome}${m.pessoa.apelido ? ` (${m.pessoa.apelido})` : ''}`
                        return (
                          <div
                            key={m.pessoa.id}
                            className="flex items-center gap-3"
                          >
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={m.pessoa.avatarUrl ?? ''} />
                              <AvatarFallback className="text-xs">
                                {m.pessoa.nome[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="flex-1 text-sm text-zinc-700">
                              {nomeMembro}
                            </span>
                            <Check className="size-4 shrink-0 text-green-500" />
                          </div>
                        )
                      })}
                      {inscricaoAtual.grupoCarne.convites
                        .filter((c) => c.status === 'PENDENTE')
                        .map((c) => {
                          const nomeConvidado = `${c.convidado.nome} ${c.convidado.sobrenome}${c.convidado.apelido ? ` (${c.convidado.apelido})` : ''}`
                          return (
                            <div key={c.id} className="flex items-center gap-3">
                              <Avatar className="h-7 w-7 shrink-0">
                                <AvatarImage
                                  src={c.convidado.avatarUrl ?? ''}
                                />
                                <AvatarFallback className="text-xs">
                                  {c.convidado.nome[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="flex-1 text-sm text-zinc-700">
                                {nomeConvidado}
                              </span>
                              <Clock className="size-4 shrink-0 text-amber-400" />
                            </div>
                          )
                        })}
                    </div>
                  </>
                )}
              </div>

              {/* Card: Como vai + Seu carro */}
              {transporteCfg && (
                <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${transporteCfg.iconBg}`}
                    >
                      <transporteCfg.icon
                        className={`size-4 ${transporteCfg.iconColor}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                        Como vai
                      </p>
                      <p className="text-sm font-semibold text-zinc-700">
                        {transporteCfg.detalhe ?? transporteCfg.label}
                      </p>
                      {transporteCfg.detalhe && (
                        <p className="text-xs text-zinc-400">
                          {transporteCfg.label}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Passageiros do motorista */}
                  {inscricaoAtual.comoVai === 'DIRIGINDO' &&
                    (data?.convitesEnviados?.length ?? 0) > 0 && (
                      <>
                        <div className="my-3 border-t border-zinc-200" />
                        <p className="mb-2 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                          Seu carro
                        </p>
                        <div className="space-y-2">
                          {[...data!.convitesEnviados]
                            .sort((a, b) => {
                              if (
                                a.status === 'ACEITO' &&
                                b.status !== 'ACEITO'
                              )
                                return -1
                              if (
                                a.status !== 'ACEITO' &&
                                b.status === 'ACEITO'
                              )
                                return 1
                              return 0
                            })
                            .map((c) => {
                              const nome = c.convidado
                                ? `${c.convidado.nome} ${c.convidado.sobrenome}${c.convidado.apelido ? ` (${c.convidado.apelido})` : ''}`
                                : '—'
                              return (
                                <div
                                  key={c.id}
                                  className="flex items-center gap-3"
                                >
                                  <Avatar className="h-7 w-7 shrink-0">
                                    <AvatarImage
                                      src={c.convidado?.avatarUrl ?? ''}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {c.convidado?.nome?.[0] ?? '?'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1 text-sm text-zinc-700">
                                    {nome}
                                  </span>
                                  {c.status === 'PENDENTE' ? (
                                    <Clock className="size-4 shrink-0 text-amber-400" />
                                  ) : (
                                    <Check className="size-4 shrink-0 text-green-500" />
                                  )}
                                </div>
                              )
                            })}
                        </div>
                      </>
                    )}

                  {/* Carro do carona */}
                  {inscricaoAtual.comoVai === 'CARONA' &&
                    inscricaoAtual.carroDa && (
                      <>
                        <div className="my-3 border-t border-zinc-200" />
                        <p className="mb-2 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                          Seu carro
                        </p>
                        <div className="space-y-2">
                          {(() => {
                            const m = inscricaoAtual.carroDa.motorista
                            const nomeM = `${m.nome} ${m.sobrenome}${m.apelido ? ` (${m.apelido})` : ''}`
                            return (
                              <div className="flex items-center gap-3">
                                <Avatar className="h-7 w-7 shrink-0">
                                  <AvatarImage src={m.avatarUrl ?? ''} />
                                  <AvatarFallback className="text-xs">
                                    {m.nome[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="flex-1 text-sm font-medium text-zinc-700">
                                  {nomeM}
                                </span>
                                <Car className="size-4 shrink-0 text-blue-400" />
                              </div>
                            )
                          })()}
                          {inscricaoAtual.carroDa.passageiros
                            .filter((p) => p.pessoa.id !== session?.user?.id)
                            .map((p) => {
                              const nomeP = `${p.pessoa.nome} ${p.pessoa.sobrenome}${p.pessoa.apelido ? ` (${p.pessoa.apelido})` : ''}`
                              return (
                                <div
                                  key={p.pessoa.id}
                                  className="flex items-center gap-3"
                                >
                                  <Avatar className="h-7 w-7 shrink-0">
                                    <AvatarImage
                                      src={p.pessoa.avatarUrl ?? ''}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {p.pessoa.nome[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="flex-1 text-sm text-zinc-700">
                                    {nomeP}
                                  </span>
                                  <Check className="size-4 shrink-0 text-green-500" />
                                </div>
                              )
                            })}
                        </div>
                      </>
                    )}
                </div>
              )}
              {inscricaoAtual.observacao && (
                <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200">
                      <MessageCircle className="size-4 text-zinc-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                        Observação
                      </p>
                      <p className="text-sm text-zinc-700">
                        {inscricaoAtual.observacao}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-400">
              Inscrito em{' '}
              {new Date(inscricaoAtual.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {da.dataDA && (
              <p className="text-primary text-sm font-medium">
                Te esperamos no DA dia{' '}
                {new Date(da.dataDA).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  timeZone: 'UTC',
                })}
                !
              </p>
            )}
            <p className="text-xs text-zinc-400">
              Para alterar seus dados, fale com um BP.
            </p>
          </CardContent>
        </Card>
      )
    }

    if (!da.aberto && !isAdmin && !isBP) {
      return (
        <Card className="w-full px-3 py-8 text-center text-zinc-700">
          <CardContent className="flex flex-col items-center gap-4">
            <Badge variant="secondary">
              <Lock className="mr-1 size-3" />
              Fechado
            </Badge>
            <p className="text-lg font-semibold">Formulário fechado</p>
            <p className="text-sm text-zinc-500">
              O formulário do DA não está aberto no momento.
            </p>
          </CardContent>
        </Card>
      )
    }

    // Step 1: mensagem inicial
    if (step === 1) {
      return (
        <Card className="w-full items-center justify-center px-3 pt-8 text-center text-zinc-700">
          <CardContent className="flex w-full flex-col gap-4">
            {da.mensagemInicial ? (
              <div
                className="prose prose-sm max-w-none text-left text-zinc-700"
                dangerouslySetInnerHTML={{ __html: da.mensagemInicial }}
              />
            ) : (
              <p className="text-xl font-bold">Bem-vindo(a) ao DA!</p>
            )}
            <Button onClick={() => setStep(2)}>
              <span className="text-xl font-semibold text-nowrap">
                Continuar
              </span>
            </Button>
          </CardContent>
        </Card>
      )
    }

    // Step 2: confirmar dados pessoais
    if (step === 2) {
      return (
        <Card className="w-full px-3 py-6 text-zinc-700">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button
                className="text-zinc-400 hover:text-zinc-600"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="size-5" />
              </button>
              <p className="text-base font-medium">Confirme seus dados</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Nome</label>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Sobrenome
                </label>
                <Input
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  placeholder="Seu sobrenome"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Celular
                </label>
                <Input
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">
                  Como gosta de ser chamado?
                </label>
                <Input
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>
            <Button
              className="w-full"
              disabled={
                !nome.trim() ||
                !sobrenome.trim() ||
                !celular.trim() ||
                updatePessoa.isPending
              }
              onClick={handleConfirmarPessoa}
            >
              {updatePessoa.isPending ? 'Salvando...' : 'Continuar'}
            </Button>
          </CardContent>
        </Card>
      )
    }

    // Step 4: como vai
    if (step === 4) {
      const veiculoInvites = data?.convitesVeiculo ?? []
      const opcoes: {
        value: ComoVai
        label: string
        desc: string
        icon: React.ElementType
      }[] = [
        {
          value: 'DIRIGINDO',
          label: 'Vou dirigindo',
          desc: 'Tenho carro e posso levar pessoas',
          icon: Car,
        },
        {
          value: 'CARONA',
          label: 'Vou de carona',
          desc: 'Preciso de uma carona',
          icon: Users,
        },
        {
          value: 'ONIBUS',
          label: 'Vou de ônibus/van',
          desc: 'Quero ir no ônibus ou van',
          icon: Bus,
        },
      ]

      return (
        <Card className="w-full px-3 py-6 text-zinc-700">
          <CardContent className="flex flex-col gap-4 p-0">
            <div className="flex items-center gap-2">
              <button
                className="text-zinc-400 hover:text-zinc-600"
                onClick={() => setStep(3)}
              >
                <ChevronLeft className="size-5" />
              </button>
              <p className="text-base font-medium">Como você vai ao DA?</p>
            </div>

            {(data?.convitesMotorista ?? []).length > 0 && (
              <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">
                  Pedidos de carona
                </p>
                <div className="space-y-2">
                  {(data?.convitesMotorista ?? []).map((c) => {
                    const isAceito = conviteMotoristaAceitos.includes(c.id)
                    const isRecusado = conviteMotoristaRecusados.includes(c.id)
                    const caronaNome = c.convidado
                      ? `${c.convidado.nome} ${c.convidado.sobrenome}${c.convidado.apelido ? ` (${c.convidado.apelido})` : ''}`
                      : 'Passageiro'
                    return (
                      <div key={c.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={c.convidado?.avatarUrl ?? ''} />
                          <AvatarFallback>
                            {c.convidado?.nome?.[0] ?? '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm text-zinc-700">
                          {caronaNome}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={isAceito ? 'default' : 'outline'}
                            onClick={() => {
                              if (conviteMotoristaAceitos.includes(c.id)) return
                              setConviteMotoristaAceitos((prev) => [
                                ...prev,
                                c.id,
                              ])
                              setConviteMotoristaRecusados((prev) =>
                                prev.filter((id) => id !== c.id),
                              )
                              if (c.convidado) {
                                const nomeConvidado = `${c.convidado.nome} ${c.convidado.sobrenome}${c.convidado.apelido ? ` (${c.convidado.apelido})` : ''}`
                                const pessoaSelecionada: PessoaSelecionada = {
                                  idPessoa: c.convidado.id,
                                  nome: nomeConvidado,
                                  avatarUrl: c.convidado.avatarUrl ?? null,
                                }
                                setConvidados((prev) => {
                                  if (
                                    prev.some(
                                      (p) => p?.idPessoa === c.convidado!.id,
                                    )
                                  )
                                    return prev
                                  const next = [...prev]
                                  const firstEmpty = next.findIndex(
                                    (x) => x === null || x === undefined,
                                  )
                                  if (firstEmpty >= 0)
                                    next[firstEmpty] = pessoaSelecionada
                                  else next.push(pessoaSelecionada)
                                  return next
                                })
                              }
                              if (
                                conviteMotoristaAceitos.length === 0 &&
                                comoVai !== 'DIRIGINDO'
                              ) {
                                setComoVai('DIRIGINDO')
                                if (carroAnterior) setUsarCarroAnterior(null)
                              }
                            }}
                          >
                            Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={
                              isRecusado
                                ? 'border-red-500 bg-red-500 text-white hover:bg-red-500/90'
                                : ''
                            }
                            onClick={() => {
                              const wasAccepted =
                                conviteMotoristaAceitos.includes(c.id)
                              setConviteMotoristaRecusados((prev) => [
                                ...prev.filter((id) => id !== c.id),
                                c.id,
                              ])
                              setConviteMotoristaAceitos((prev) =>
                                prev.filter((id) => id !== c.id),
                              )
                              if (wasAccepted && c.convidado) {
                                setConvidados((prev) =>
                                  prev.map((p) =>
                                    p?.idPessoa === c.convidado!.id ? null : p,
                                  ),
                                )
                              }
                            }}
                          >
                            Recusar
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {veiculoInvites.length > 0 && (
              <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">
                  Convites de carona
                </p>
                <div className="space-y-2">
                  {veiculoInvites.map((c) => {
                    const isAceito = aceitarConviteVeiculoId === c.id
                    const isRecusado = conviteVeiculoRejeitados.includes(c.id)
                    const motoristaNome = c.motorista
                      ? `${c.motorista.nome} ${c.motorista.sobrenome}${c.motorista.apelido ? ` (${c.motorista.apelido})` : ''}`
                      : 'Motorista'
                    return (
                      <div key={c.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={c.motorista?.avatarUrl ?? ''} />
                          <AvatarFallback>
                            {c.motorista?.nome?.[0] ?? '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-700">
                            {motoristaNome}
                          </p>
                          {c.carroDa && (
                            <p className="text-xs text-zinc-500">
                              {[
                                c.carroDa.modelo,
                                c.carroDa.placa,
                                `${c.carroDa.vagas} vagas`,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            size="sm"
                            variant={isAceito ? 'default' : 'outline'}
                            onClick={() => {
                              if (isAceito) return
                              setAceitarConviteVeiculoId(c.id)
                              setComoVai('CARONA')
                              setConviteVeiculoRejeitados((prev) =>
                                prev.filter((id) => id !== c.id),
                              )
                              if (c.motorista) {
                                const motoristaNomeCompleto = `${c.motorista.nome} ${c.motorista.sobrenome}${c.motorista.apelido ? ` (${c.motorista.apelido})` : ''}`
                                setMotoristaSelecionado({
                                  idPessoa: c.motorista.id,
                                  nome: motoristaNomeCompleto,
                                  avatarUrl: c.motorista.avatarUrl,
                                })
                              }
                            }}
                          >
                            Aceitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={
                              isRecusado
                                ? 'border-red-500 bg-red-500 text-white hover:bg-red-500/90'
                                : ''
                            }
                            onClick={() => {
                              if (isAceito) {
                                setAceitarConviteVeiculoId(null)
                                setComoVai(null)
                                setMotoristaSelecionado(null)
                              }
                              setConviteVeiculoRejeitados((prev) => [
                                ...prev.filter((id) => id !== c.id),
                                c.id,
                              ])
                            }}
                          >
                            Recusar
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="grid gap-2">
              {opcoes.map(({ value, label, desc, icon: Icon }) => {
                const selecionado = comoVai === value
                const bloqueado =
                  conviteMotoristaAceitos.length > 0 && value !== 'DIRIGINDO'
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={bloqueado}
                    onClick={() => handleComoVaiSelect(value)}
                    className={[
                      'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                      bloqueado
                        ? 'cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-40'
                        : selecionado
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'cursor-pointer border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50',
                    ].join(' ')}
                  >
                    <Icon
                      className={`size-5 shrink-0 ${selecionado ? 'text-primary' : 'text-zinc-400'}`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${selecionado ? 'text-primary' : 'text-zinc-700'}`}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-zinc-400">{desc}</p>
                    </div>
                    {selecionado && (
                      <Check className="text-primary ml-auto size-5 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Car form for DIRIGINDO */}
            {comoVai === 'DIRIGINDO' && (
              <div className="mt-1 space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">
                  Dados do seu carro
                </p>

                {carroAnterior && usarCarroAnterior === null && (
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500">
                      Encontramos seu carro cadastrado anteriormente:
                    </p>
                    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
                      <p className="font-medium">{carroAnterior.modeloCarro}</p>
                      <p className="text-xs text-zinc-400">
                        {carroAnterior.placaCarro}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="tertiary"
                        className="w-full"
                        onClick={() => {
                          setUsarCarroAnterior(true)
                          setCarroModelo(carroAnterior.modeloCarro)
                          setCarroPlaca(carroAnterior.placaCarro)
                          setCarroVagas(String(carroAnterior.lugaresCarro - 1))
                        }}
                      >
                        Sim, é esse
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={() => setUsarCarroAnterior(false)}
                      >
                        Não, usar outro
                      </Button>
                    </div>
                  </div>
                )}

                {(usarCarroAnterior === false ||
                  (!carroAnterior && comoVai === 'DIRIGINDO')) && (
                  <div className="space-y-2">
                    {usarCarroAnterior === false && (
                      <button
                        className="mb-1 flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600"
                        onClick={() => setUsarCarroAnterior(null)}
                      >
                        <ChevronLeft className="size-3" /> Usar carro anterior
                      </button>
                    )}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs text-zinc-500">
                          Modelo
                        </label>
                        <Input
                          placeholder="Ex: Gol, HB20"
                          value={carroModelo}
                          onChange={(e) => setCarroModelo(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-zinc-500">
                          Placa
                        </label>
                        <Input
                          placeholder="ABC-1234"
                          value={carroPlaca}
                          onChange={(e) =>
                            setCarroPlaca(e.target.value.toUpperCase())
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-500">
                        Vagas para passageiros
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={9}
                        value={carroVagas}
                        onChange={(e) => setCarroVagas(e.target.value)}
                        wrapperClassName="w-24"
                      />
                    </div>
                  </div>
                )}

                {usarCarroAnterior === true && carroAnterior && (
                  <div className="border-primary/20 bg-primary/5 space-y-2 rounded-lg border px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary text-sm font-medium">
                          {carroAnterior.modeloCarro}
                        </p>
                        <p className="text-primary/70 text-xs">
                          {carroAnterior.placaCarro}
                        </p>
                      </div>
                      <button
                        className="text-xs text-zinc-400 hover:text-zinc-600"
                        onClick={() => setUsarCarroAnterior(null)}
                      >
                        Alterar
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-primary/70 text-xs">
                        Vagas para passageiros
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={9}
                        value={carroVagas}
                        onChange={(e) => setCarroVagas(e.target.value)}
                        wrapperClassName="w-20"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inputs de passageiros — aparecem após a escolha do carro */}
            {comoVai === 'DIRIGINDO' &&
              (!carroAnterior || usarCarroAnterior !== null) &&
              Number(carroVagas) > 0 && (
                <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-medium text-zinc-700">
                    Quem vai no seu carro?{' '}
                    <span className="font-normal text-zinc-400">
                      (opcional)
                    </span>
                  </p>
                  <div className="space-y-2">
                    {Array.from({
                      length: Math.min(Number(carroVagas) || 0, 9),
                    }).map((_, i) => (
                      <PessoaSearchInput
                        key={i}
                        value={convidados[i] ?? null}
                        onChange={(v) => {
                          const anterior = convidados[i]
                          setConvidados((prev) => {
                            const next = [...prev]
                            next[i] = v
                            return next
                          })
                          if (v === null && anterior) {
                            const conviteAceito = (
                              data?.convitesMotorista ?? []
                            ).find(
                              (c) =>
                                c.convidado?.id === anterior.idPessoa &&
                                conviteMotoristaAceitos.includes(c.id),
                            )
                            if (conviteAceito) {
                              setConviteMotoristaRecusados((prev) => [
                                ...prev.filter((id) => id !== conviteAceito.id),
                                conviteAceito.id,
                              ])
                              setConviteMotoristaAceitos((prev) =>
                                prev.filter((id) => id !== conviteAceito.id),
                              )
                            }
                          }
                        }}
                        excluir={[
                          session?.user?.id ?? '',
                          ...convidados
                            .filter(
                              (c, j): c is PessoaSelecionada =>
                                c !== null && j !== i,
                            )
                            .map((c) => c.idPessoa),
                        ]}
                        placeholder={`Passageiro ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* Busca opcional de motorista para CARONA */}
            {comoVai === 'CARONA' && (
              <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">
                  Já tem carona?{' '}
                  <span className="font-normal text-zinc-400">(opcional)</span>
                </p>
                <PessoaSearchInput
                  value={motoristaSelecionado}
                  onChange={(v) => {
                    setMotoristaSelecionado(v)
                    setAvisoMotoristaInscrito(null)
                  }}
                  placeholder="Buscar motorista por nome..."
                />
                {avisoMotoristaInscrito && (
                  <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm text-amber-800">
                      {avisoMotoristaInscrito}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        disabled={criarConviteVeiculo.isPending}
                        onClick={async () => {
                          if (!da || !motoristaSelecionado) return
                          try {
                            await criarConviteVeiculo.mutateAsync({
                              idDA: da.id,
                              idMotorista: motoristaSelecionado.idPessoa,
                              force: true,
                            })
                            setAvisoMotoristaInscrito(null)
                            setStep(5)
                          } catch (err: unknown) {
                            const errData = (
                              err as {
                                response?: { data?: { error?: string } }
                              }
                            )?.response?.data
                            toast.error(
                              errData?.error ?? 'Erro ao enviar convite.',
                            )
                          }
                        }}
                      >
                        Enviar mesmo assim
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => {
                          setAvisoMotoristaInscrito(null)
                          setMotoristaSelecionado(null)
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full"
              disabled={
                !comoVai ||
                !carroFormPreenchido ||
                criarConviteVeiculo.isPending
              }
              onClick={
                comoVai === 'CARONA' && motoristaSelecionado
                  ? handleContinuarStep3
                  : () => setStep(5)
              }
            >
              {criarConviteVeiculo.isPending ? 'Aguarde...' : 'Continuar'}
            </Button>
          </CardContent>
        </Card>
      )
    }

    // Step 5: observações
    if (step === 5) {
      return (
        <Card className="w-full px-3 py-6 text-zinc-700">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <button
                className="text-zinc-400 hover:text-zinc-600"
                onClick={() => setStep(4)}
              >
                <ChevronLeft className="size-5" />
              </button>
              <p className="text-base font-medium">Alguma observação?</p>
            </div>
            <p className="text-sm text-zinc-500">
              Caso tenha algo a acrescentar aos BPs fique à vontade.
            </p>
            <Textarea
              placeholder="Ex: vou chegar às 14h, tenho alergia ao azeite..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="resize-none text-sm"
              rows={4}
            />
            <Button
              className="w-full"
              disabled={inscrever.isPending || criarCarro.isPending}
              onClick={handleConfirmar}
            >
              {inscrever.isPending || criarCarro.isPending
                ? 'Confirmando...'
                : 'Confirmar presença no DA'}
            </Button>
          </CardContent>
        </Card>
      )
    }

    // Step 3: item selection
    const carneInvites = data?.convitesCarne ?? []
    const itemAtual = da.itens.find((i) => i.id === itemSelecionado)
    const acceptedInviteItemId = carneInvites.find(
      (c) => c.id === aceitarConviteCarneId,
    )?.grupoCarne.idItem
    const precisaDescricao =
      !aceitarConviteCarneId &&
      itemAtual?.categoria === 'SOBREMESA' &&
      !itemAtual.nome.toLowerCase().includes('sorvete')
    const vagasConvidar = aceitarConviteCarneId
      ? 1
      : (itemAtual?.pessoasPorUnidade ?? 0) - 1

    return (
      <Card className="w-full px-3 py-6 text-zinc-700">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button
              className="text-zinc-400 hover:text-zinc-600"
              onClick={() => {
                setAceitarConviteCarneId(null)
                setItemSelecionado(null)
                setStep(2)
              }}
            >
              <ChevronLeft className="size-5" />
            </button>
            <p className="text-base font-medium">O que você vai levar?</p>
          </div>

          {/* Convites de carne — fixos com toggle aceitar/recusar */}
          {carneInvites.length > 0 && (
            <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-700">
                Convites para compartilhar
              </p>
              <div className="space-y-2">
                {carneInvites.map((c) => {
                  const isAceito = aceitarConviteCarneId === c.id
                  const isRecusado = conviteCarneRejeitados.includes(c.id)
                  const inviterRaw = c.grupoCarne.membros[0]?.pessoa
                  const inviterNome = inviterRaw
                    ? `${inviterRaw.nome} ${inviterRaw.sobrenome}${inviterRaw.apelido ? ` (${inviterRaw.apelido})` : ''}`
                    : null
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      {inviterRaw && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage
                            src={inviterRaw.avatarUrl ?? undefined}
                          />
                          <AvatarFallback>{inviterRaw.nome[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-700">
                          <span className="font-medium">
                            {inviterRaw?.nome ?? '?'}
                          </span>
                          {' · '}
                          <span className="text-zinc-500">
                            {c.grupoCarne.itemDA.item.nome}
                          </span>
                        </p>
                        <p className="text-xs text-zinc-400">
                          Grupo de {c.grupoCarne.capacidade} pessoas
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          variant={isAceito ? 'default' : 'outline'}
                          onClick={() => {
                            if (isAceito) return
                            setAceitarConviteCarneId(c.id)
                            setItemSelecionado(c.grupoCarne.idItem)
                            setConviteCarneRejeitados((prev) =>
                              prev.filter((id) => id !== c.id),
                            )
                            if (inviterRaw) {
                              setConvidadosCarne([
                                {
                                  idPessoa: inviterRaw.id,
                                  nome: inviterNome!,
                                  avatarUrl: inviterRaw.avatarUrl,
                                },
                              ])
                            } else {
                              setConvidadosCarne([])
                            }
                          }}
                        >
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={
                            isRecusado
                              ? 'border-red-500 bg-red-500 text-white hover:bg-red-500/90'
                              : ''
                          }
                          onClick={() => {
                            if (isAceito) {
                              setAceitarConviteCarneId(null)
                              setItemSelecionado(null)
                              setConvidadosCarne([])
                            }
                            setConviteCarneRejeitados((prev) => [
                              ...prev.filter((id) => id !== c.id),
                              c.id,
                            ])
                          }}
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Grade de itens — sempre visível */}
          <div className="grid gap-2">
            {da.itens
              .slice()
              .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
              .map((item) => {
                const ilimitado = item.quantidade === null
                const disponiveis = ilimitado
                  ? null
                  : item.quantidade! - item._count.inscricoes
                const esgotado = !ilimitado && disponiveis! <= 0
                const selecionado = itemSelecionado === item.id
                const itemPrecisaDescricao =
                  selecionado &&
                  !aceitarConviteCarneId &&
                  item.categoria === 'SOBREMESA' &&
                  !item.nome.toLowerCase().includes('sorvete')

                return (
                  <Fragment key={item.id}>
                    <button
                      type="button"
                      disabled={esgotado}
                      onClick={() => {
                        const newId = esgotado ? null : item.id
                        setItemSelecionado(newId)
                        if (newId !== null) {
                          // Auto-reject invites whose item doesn't match selection
                          const toReject = carneInvites
                            .filter((c) => c.grupoCarne.idItem !== newId)
                            .map((c) => c.id)
                          if (toReject.length > 0) {
                            setConviteCarneRejeitados((prev) => [
                              ...prev,
                              ...toReject.filter((id) => !prev.includes(id)),
                            ])
                          }
                          // Clear accepted invite if selecting a different item
                          if (
                            aceitarConviteCarneId &&
                            newId !== acceptedInviteItemId
                          ) {
                            setAceitarConviteCarneId(null)
                            setConvidadosCarne([])
                          }
                          // Auto-accept if sharing person is already set and matches invite
                          if (
                            !aceitarConviteCarneId ||
                            newId === acceptedInviteItemId
                          ) {
                            const match = carneInvites.find(
                              (c) =>
                                c.grupoCarne.idItem === newId &&
                                convidadosCarne.some(
                                  (p) =>
                                    p?.idPessoa ===
                                    c.grupoCarne.membros[0]?.pessoa.id,
                                ),
                            )
                            if (match) {
                              setAceitarConviteCarneId(match.id)
                              setConviteCarneRejeitados((prev) =>
                                prev.filter((id) => id !== match.id),
                              )
                            }
                          }
                        }
                      }}
                      className={[
                        'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all',
                        esgotado
                          ? 'cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50'
                          : selecionado
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'cursor-pointer border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50',
                      ].join(' ')}
                    >
                      <div>
                        <p
                          className={`text-sm font-medium ${selecionado ? 'text-primary' : 'text-zinc-700'}`}
                        >
                          {item.nome}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {esgotado ? (
                            'Esgotado'
                          ) : ilimitado ? (
                            <span className="flex items-center gap-1">
                              <InfinityIcon className="size-3" /> disponível
                            </span>
                          ) : (
                            `${disponiveis} ${disponiveis !== 1 ? 'itens disponíveis' : 'item disponível'}`
                          )}
                        </p>
                      </div>
                      {selecionado && (
                        <Check className="text-primary size-5 shrink-0" />
                      )}
                    </button>
                    {itemPrecisaDescricao && (
                      <Input
                        placeholder="Ex: Pudim, Mousse de limão..."
                        value={descricaoItem}
                        onChange={(e) => setDescricaoItem(e.target.value)}
                      />
                    )}
                    {selecionado && vagasConvidar > 0 && (
                      <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm font-medium text-zinc-700">
                          Convidar para compartilhar?{' '}
                          <span className="font-normal text-zinc-400">
                            (opcional)
                          </span>
                        </p>
                        <div className="space-y-2">
                          {Array.from({ length: vagasConvidar }).map((_, i) => (
                            <PessoaSearchInput
                              key={i}
                              value={convidadosCarne[i] ?? null}
                              onChange={(v) => {
                                setConvidadosCarne((prev) => {
                                  const next = [...prev]
                                  next[i] = v
                                  return next
                                })
                                if (v === null && aceitarConviteCarneId) {
                                  const id = aceitarConviteCarneId
                                  setAceitarConviteCarneId(null)
                                  setConviteCarneRejeitados((prev) => [
                                    ...prev.filter((x) => x !== id),
                                    id,
                                  ])
                                }
                                if (v && !aceitarConviteCarneId) {
                                  const match = carneInvites.find(
                                    (c) =>
                                      c.grupoCarne.idItem === itemSelecionado &&
                                      c.grupoCarne.membros[0]?.pessoa.id ===
                                        v.idPessoa,
                                  )
                                  if (match) {
                                    setAceitarConviteCarneId(match.id)
                                    setConviteCarneRejeitados((prev) =>
                                      prev.filter((id) => id !== match.id),
                                    )
                                  }
                                }
                              }}
                              excluir={[
                                session?.user?.id ?? '',
                                ...convidadosCarne
                                  .filter(
                                    (c, j): c is PessoaSelecionada =>
                                      c !== null && j !== i,
                                  )
                                  .map((c) => c.idPessoa),
                              ]}
                              placeholder={`Pessoa ${i + 2}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </Fragment>
                )
              })}
          </div>
          <Button
            className="w-full"
            disabled={
              !aceitarConviteCarneId &&
              (!itemSelecionado || (precisaDescricao && !descricaoItem.trim()))
            }
            onClick={() => setStep(4)}
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    )
  }

  const dataFormatada = da?.dataDA
    ? new Date(da.dataDA).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : null

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="text-center">
        <span className="text-4xl font-bold text-white">
          {encontro
            ? `${encontro.numeroEncontro}º Dia da Amizade`
            : 'Dia da Amizade'}
        </span>
        {dataFormatada && (
          <p className="mt-1 text-lg font-medium text-white/80">
            {dataFormatada}
          </p>
        )}
      </div>
      <div className="lg:w-card w-11/12 px-0 lg:px-8">{renderCard()}</div>
    </div>
  )
}
