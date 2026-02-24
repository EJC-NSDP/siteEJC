'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import {
  actionChangeEncontristas,
  actionFecharEncontro,
  actionLimparCartas,
  actionLimparMontagem,
  actionResetRoles,
} from './actions'
import { BotaoAcao } from './BotaoAcao'
import { CardAcao } from './CardAcao'

export interface CardsNovoEncontroProps {
  ultimoEncontro: boolean
  encontristas: boolean
  cartas: boolean
  montagem: boolean
  temEncontroAberto: boolean
}

export function CardsNovoEncontro({
  ultimoEncontro,
  encontristas,
  cartas,
  montagem,
  temEncontroAberto,
}: CardsNovoEncontroProps) {
  const [acessoUltimoEncontro, setAcessoUltimoEncontro] =
    useState(ultimoEncontro)
  const [mudarEncontristas, setMudarEncontristas] = useState(encontristas)
  const [limparCartas, setLimparCartas] = useState(cartas)
  const [limparMontagem, setLimparMontagem] = useState(montagem)
  const [encontroAberto, setEncontroAberto] = useState(temEncontroAberto)

  const todasAcoesFeitas =
    acessoUltimoEncontro && mudarEncontristas && limparCartas && limparMontagem
  const podeFechar = todasAcoesFeitas && encontroAberto

  function getButtonText() {
    if (!encontroAberto) return 'Sem encontro aberto'
    if (!todasAcoesFeitas)
      return 'Cheque todos os campos acima para fechar o Encontro'
    return 'Fechar Encontro Atual'
  }

  async function handleResetRoles() {
    try {
      await actionResetRoles()
      setAcessoUltimoEncontro(true)
    } catch {
      toast.error('Erro ao remover os acessos')
    }
  }

  async function handleChangeEncontristas() {
    try {
      await actionChangeEncontristas()
      setMudarEncontristas(true)
    } catch {
      toast.error('Erro ao atualizar os encontristas')
    }
  }

  async function handleLimparCartas() {
    try {
      await actionLimparCartas()
      setLimparCartas(true)
    } catch {
      toast.error('Erro ao limpar as cartas')
    }
  }

  async function handleLimparMontagem() {
    try {
      await actionLimparMontagem()
      setLimparMontagem(true)
    } catch {
      toast.error('Erro ao limpar as equipes da montagem')
    }
  }

  async function handleFecharEncontro() {
    try {
      await actionFecharEncontro()
      setEncontroAberto(false)
    } catch {
      toast.error('Erro ao fechar o encontro')
    }
  }

  return (
    <div className="space-y-4">
      <CardAcao
        title="Tirar acessos do último Encontro"
        description="Retire o acesso dos coordenadores aos sistemas exclusivos do site. Essa ação não afetará os acessos normais, apenas aqueles que tem relação com o encontro passado."
        status={acessoUltimoEncontro}
      >
        <BotaoAcao
          state={acessoUltimoEncontro}
          content="Remover acessos"
          altContent="Todos os acessos já removidos"
          handleAction={handleResetRoles}
        />
      </CardAcao>
      <CardAcao
        title="Transformar encontristas em encontreiros"
        description="Altere os encontristas confirmados e confirmados sem sexta para encontreiros. Essa ação removerá todas as informações que não são mais relevantes das pessoas que já fizeram o último Encontro. Essa ação também exlcuirá quem está com o status desistiu ou foi deletado no último Encontro do banco de dados"
        status={mudarEncontristas}
      >
        <BotaoAcao
          state={mudarEncontristas}
          content="Alterar encontristas"
          altContent="A lista de encontristas está limpa"
          handleAction={handleChangeEncontristas}
        />
      </CardAcao>
      <CardAcao
        title="Limpar cartas"
        description="Remova todas as cartas recebidas no último Encontro"
        status={limparCartas}
      >
        <BotaoAcao
          state={limparCartas}
          content="Limpar Cartas"
          altContent="Sem cartas enviadas"
          handleAction={handleLimparCartas}
        />
      </CardAcao>
      <CardAcao
        title="Limpar montagem"
        description="Remova todas as equipes do módulo de montagem. Lembrando que isso não removerá a equipe já cadastrada dos encontreiros."
        status={limparMontagem}
      >
        <BotaoAcao
          state={limparMontagem}
          content="Limpar Montagem"
          altContent="Encontreiros sem equipes na montagem"
          handleAction={handleLimparMontagem}
        />
      </CardAcao>
      <Button
        disabled={!podeFechar}
        className="w-full py-8 text-xl disabled:cursor-not-allowed disabled:bg-zinc-300"
        onClick={handleFecharEncontro}
      >
        {getButtonText()}
      </Button>
    </div>
  )
}
