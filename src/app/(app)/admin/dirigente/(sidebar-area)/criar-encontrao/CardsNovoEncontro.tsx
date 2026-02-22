'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import {
  actionChangeEncontristas,
  actionLimparCartas,
  actionLimparMontagem,
  actionResetRoles,
} from './actions'
import { BotaoAcao } from './BotaoAcao'
import { CardAcao } from './CardAcao'

import { Button } from '@/components/ui/button'

export interface CardsNovoEncontroProps {
  ultimoEncontro: boolean
  encontristas: boolean
  cartas: boolean
  montagem: boolean
}

export function CardsNovoEncontro({
  ultimoEncontro,
  encontristas,
  cartas,
  montagem,
}: CardsNovoEncontroProps) {
  const [acessoUltimoEncontro, setAcessoUltimoEncontro] =
    useState(ultimoEncontro)
  const [mudarEncontristas, setMudarEncontristas] = useState(encontristas)
  const [limparCartas, setLimparCartas] = useState(cartas)
  const [limparMontagem, setLimparMontagem] = useState(montagem)
  const criarEncontrao =
    acessoUltimoEncontro && mudarEncontristas && limparCartas && limparMontagem

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

  return (
    <div className="space-y-4">
      <CardAcao
        title="Tirar acessos do último Encontrão"
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
        description="Altere os encontristas confirmados e confirmados sem sexta para encontreiros. Essa ação removerá todas as informações que não são mais relevantes das pessoas que já fizeram o último Encontrão. Essa ação também exlcuirá quem está com o status desistiu ou foi deletado no último Encontrão do banco de dados"
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
        description="Remova todas as cartas recebidas no último Encontrão"
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
        disabled={!criarEncontrao}
        className="w-full py-8 text-xl disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {criarEncontrao
          ? 'Criar Novo Encontrão'
          : 'Cheque todos os campos acima para criar um novo Encontrão'}
      </Button>
    </div>
  )
}
