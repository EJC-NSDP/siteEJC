import { Clock } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import {
  getEncontroParaAvaliacao,
  getEquipesParaIndicacao,
  getAvaliacaoExistente,
  getAutorAvaliacao,
} from '@/app/api/avaliacao/get-avaliacao-coordenador'
import { getPerguntasAtivas } from '@/app/api/avaliacao/get-perguntas'
import { AvaliacaoForm } from '@/components/Avaliacao/AvaliacaoForm'
import { Card, CardContent } from '@/components/ui/card'
import { authOptions } from '@/lib/auth/auth-options'
import { isAvaliacaoDisponivel } from '@/utils/avaliacao'

export default async function CoordenadorAvaliacaoPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [encontro, perguntas, equipes] = await Promise.all([
    getEncontroParaAvaliacao(),
    getPerguntasAtivas(),
    getEquipesParaIndicacao(),
  ])

  if (!encontro) {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-4">
        <span className="text-4xl font-bold text-white">Avaliação</span>
        <Card className="lg:w-card w-11/12">
          <CardContent className="pt-6 text-zinc-600">
            Nenhum encontro configurado ainda.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!encontro.isReceivingAvaliacoes) {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-4">
        <span className="text-4xl font-bold text-white">
          Avaliação — {encontro.numeroEncontro}º EJC
        </span>
        <Card className="lg:w-card w-11/12">
          <CardContent className="flex items-center gap-3 pt-6 text-zinc-500">
            <Clock className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              As avaliações ainda não estão abertas. Aguarde a liberação pelos
              dirigentes.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const disponivel = isAvaliacaoDisponivel(encontro.dataInicio)
  const dataLiberacao = new Date(encontro.dataInicio)
  dataLiberacao.setDate(dataLiberacao.getDate() + 3)

  if (!disponivel) {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-4">
        <span className="text-4xl font-bold text-white">
          Avaliação — {encontro.numeroEncontro}º EJC
        </span>
        <Card className="lg:w-card w-11/12">
          <CardContent className="flex items-center gap-3 pt-6 text-amber-700">
            <Clock className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              A avaliação estará disponível a partir de{' '}
              <strong>{dataLiberacao.toLocaleDateString('pt-BR')}</strong>.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [jaEnviou, autorInfo] = await Promise.all([
    getAvaliacaoExistente(encontro.id, session.user.id),
    getAutorAvaliacao(session.user.id),
  ])

  return (
    <div className="flex w-full flex-col items-center gap-4 py-4">
      <span className="text-4xl font-bold text-white">
        Avaliação — {encontro.numeroEncontro}º EJC
      </span>
      <AvaliacaoForm
        idEncontro={encontro.id}
        numeroEncontro={encontro.numeroEncontro}
        slugAutor={autorInfo?.slug ?? ''}
        equipeAutor={autorInfo?.encontreiro?.equipeMontagem?.valueEquipe ?? ''}
        jaEnviouEm={jaEnviou?.createdAt?.toISOString() ?? null}
        perguntas={perguntas.map((p) => ({
          ...p,
          tipo: p.tipo as 'TEXTO_LONGO' | 'INDICACOES' | 'ARQUIVO',
          categoria: p.categoria as
            | 'SUA_EQUIPE'
            | 'CANDIDATOS'
            | 'O_ENCONTRAO'
            | 'PARA_O_FUTURO'
            | 'DIRIGENCIA'
            | 'OUTROS',
        }))}
        equipes={equipes}
        respostasIniciais={jaEnviou?.respostas ?? []}
        indicacoesIniciais={
          jaEnviou?.indicacoes.map((i) => ({
            idEncontreiro: i.idEncontreiro,
            equipeIndicada: i.equipeIndicada,
            avaliacao: i.avaliacao,
            nomeDisplay: `${i.encontreiro.pessoa.nome} ${i.encontreiro.pessoa.sobrenome}${i.encontreiro.pessoa.apelido ? ` (${i.encontreiro.pessoa.apelido})` : ''}`,
            avatarUrl: i.encontreiro.pessoa.avatarUrl,
          })) ?? []
        }
      />
    </div>
  )
}
