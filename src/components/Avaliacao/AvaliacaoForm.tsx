'use client'

import {
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  Paperclip,
  Send,
  Star,
  ThumbsUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import type { ElementType } from 'react'
import { toast } from 'sonner'

import { CardForm } from '@/components/Form/CardForm'
import { Nav } from '@/components/Nav/Nav'
import { NavItem } from '@/components/Nav/NavItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/axios'

import { IndicacaoInput, type IndicacaoItem } from './IndicacaoInput'

type CategoriaAvaliacao =
  | 'SUA_EQUIPE'
  | 'CANDIDATOS'
  | 'O_ENCONTRAO'
  | 'PARA_O_FUTURO'
  | 'DIRIGENCIA'
  | 'OUTROS'

interface Pergunta {
  id: string
  chave: string
  texto: string
  descricao: string | null
  tipo: 'TEXTO_LONGO' | 'INDICACOES' | 'ARQUIVO'
  categoria: CategoriaAvaliacao
  ordem: number
}

interface Equipe {
  equipeValue: string
  equipeLabel: string
}

interface RespostaInicial {
  idPergunta: string
  resposta: string | null
  fileUrl: string | null
  fileName: string | null
}

interface IndicacaoInicial {
  idEncontreiro: string
  equipeIndicada: string
  avaliacao: string
  nomeDisplay: string
  avatarUrl: string | null
}

interface AvaliacaoFormProps {
  idEncontro: string
  numeroEncontro: number
  slugAutor: string
  equipeAutor: string
  jaEnviouEm: string | null
  perguntas: Pergunta[]
  equipes: Equipe[]
  respostasIniciais?: RespostaInicial[]
  indicacoesIniciais?: IndicacaoInicial[]
}

const CATEGORIA_META: Record<
  CategoriaAvaliacao,
  { titulo: string; icon: ElementType }
> = {
  SUA_EQUIPE: { titulo: 'Sua Equipe', icon: Users },
  CANDIDATOS: { titulo: 'Candidatos', icon: UserCheck },
  O_ENCONTRAO: { titulo: 'O Encontrão', icon: Star },
  PARA_O_FUTURO: { titulo: 'Para o Futuro', icon: Lightbulb },
  DIRIGENCIA: { titulo: 'Dirigência', icon: MessageCircle },
  OUTROS: { titulo: 'Outros', icon: ThumbsUp },
}

const CATEGORIA_ORDER: CategoriaAvaliacao[] = [
  'SUA_EQUIPE',
  'CANDIDATOS',
  'O_ENCONTRAO',
  'PARA_O_FUTURO',
  'DIRIGENCIA',
  'OUTROS',
]

export function AvaliacaoForm({
  idEncontro,
  numeroEncontro,
  slugAutor,
  equipeAutor,
  jaEnviouEm,
  perguntas,
  equipes,
  respostasIniciais,
  indicacoesIniciais,
}: AvaliacaoFormProps) {
  const perguntaArquivo = perguntas.find((p) => p.tipo === 'ARQUIVO')

  const [respostas, setRespostas] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (respostasIniciais ?? [])
        .filter((r) => r.resposta !== null)
        .map((r) => [r.idPergunta, r.resposta!]),
    ),
  )

  const [indicacoes, setIndicacoes] = useState<IndicacaoItem[]>(() =>
    (indicacoesIniciais ?? []).map((i) => ({
      uid: crypto.randomUUID(),
      idEncontreiro: i.idEncontreiro,
      nomeDisplay: i.nomeDisplay,
      avatarUrl: i.avatarUrl,
      equipeIndicada: i.equipeIndicada,
      avaliacao: i.avaliacao,
    })),
  )

  const [arquivo, setArquivo] = useState<{
    file: File
    perguntaId: string
  } | null>(null)
  const [urlParaDeletar, setUrlParaDeletar] = useState<string | null>(null)
  const [arquivoExistente, setArquivoExistente] = useState<{
    url: string
    nome: string
  } | null>(() => {
    if (!perguntaArquivo) return null
    const found = respostasIniciais?.find(
      (r) => r.idPergunta === perguntaArquivo.id && r.fileUrl,
    )
    return found
      ? { url: found.fileUrl!, nome: found.fileName ?? 'arquivo' }
      : null
  })

  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categoriasAtivas = CATEGORIA_ORDER.map((cat) => ({
    cat,
    ...CATEGORIA_META[cat],
    perguntas: perguntas
      .filter((p) => p.categoria === cat)
      .sort((a, b) => a.ordem - b.ordem),
  })).filter((c) => c.perguntas.length > 0)

  function setResposta(id: string, valor: string) {
    setRespostas((prev) => ({ ...prev, [id]: valor }))
  }

  async function uploadArquivo(
    file: File,
  ): Promise<{ url: string; nome: string }> {
    const timestamp = Math.floor(Date.now() / 1000)
    const publicId = `${slugAutor}-${equipeAutor}-${numeroEncontro}`
    const signRes = await api.post('cloudinary/sign-upload', {
      paramsToSign: { folder: 'dicas', timestamp, public_id: publicId },
    })
    const { signature } = signRes.data

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'dicas')
    formData.append('public_id', publicId)
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
    formData.append('signature', signature)
    formData.append('timestamp', String(timestamp))

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
      { method: 'POST', body: formData },
    )
    const data = await cloudRes.json()
    if (!data.secure_url) throw new Error('Upload failed')
    return { url: data.secure_url, nome: file.name }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const textosVazios = perguntas.filter(
      (p) => p.tipo === 'TEXTO_LONGO' && !respostas[p.id]?.trim(),
    )
    if (textosVazios.length > 0) {
      toast.error('Preencha todas as perguntas antes de enviar.')
      return
    }

    if (
      indicacoes.some(
        (i) => !i.idEncontreiro || !i.equipeIndicada || !i.avaliacao.trim(),
      )
    ) {
      toast.error('Complete todas as indicações ou remova as incompletas.')
      return
    }

    setSubmitting(true)
    try {
      const respostasPayload: {
        idPergunta: string
        resposta?: string
        fileUrl?: string
        fileName?: string
      }[] = perguntas
        .filter((p) => p.tipo === 'TEXTO_LONGO')
        .map((p) => ({ idPergunta: p.id, resposta: respostas[p.id] ?? '' }))

      if (perguntaArquivo) {
        if (arquivo) {
          const { url, nome } = await uploadArquivo(arquivo.file)
          respostasPayload.push({
            idPergunta: perguntaArquivo.id,
            fileUrl: url,
            fileName: nome,
          })
        } else if (urlParaDeletar) {
          await api.post('cloudinary/delete', { fileUrl: urlParaDeletar })
          respostasPayload.push({ idPergunta: perguntaArquivo.id })
        } else if (arquivoExistente) {
          respostasPayload.push({
            idPergunta: perguntaArquivo.id,
            fileUrl: arquivoExistente.url,
            fileName: arquivoExistente.nome,
          })
        } else {
          respostasPayload.push({ idPergunta: perguntaArquivo.id })
        }
      }

      await api.post('avaliacao', {
        idEncontro,
        respostas: respostasPayload,
        indicacoes: indicacoes.map((i) => ({
          idEncontreiro: i.idEncontreiro,
          equipeIndicada: i.equipeIndicada,
          avaliacao: i.avaliacao,
        })),
      })

      toast.success(
        jaEnviouEm
          ? 'Avaliação atualizada com sucesso!'
          : 'Avaliação enviada com sucesso!',
      )
      window.location.reload()
    } catch {
      toast.error('Erro ao enviar avaliação. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  function renderPergunta(pergunta: Pergunta) {
    return (
      <div key={pergunta.id} className="flex flex-col gap-2 pt-4 first:pt-0">
        <p className="text-base font-semibold text-zinc-700">
          {pergunta.texto}
        </p>
        {pergunta.descricao && (
          <p className="text-sm text-zinc-500">{pergunta.descricao}</p>
        )}

        {pergunta.tipo === 'TEXTO_LONGO' && (
          <Textarea
            rows={5}
            placeholder="Sua resposta..."
            value={respostas[pergunta.id] ?? ''}
            onChange={(e) => setResposta(pergunta.id, e.target.value)}
            className="mt-1 resize-y"
          />
        )}

        {pergunta.tipo === 'INDICACOES' && (
          <div className="mt-1">
            <IndicacaoInput
              equipes={equipes}
              value={indicacoes}
              onChange={setIndicacoes}
            />
          </div>
        )}

        {pergunta.tipo === 'ARQUIVO' && (
          <div className="mt-1 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="mr-2 h-4 w-4" />
              {arquivo || arquivoExistente
                ? 'Trocar arquivo'
                : 'Selecionar arquivo'}
            </Button>
            {arquivo ? (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <span>{arquivo.file.name}</span>
                <button
                  type="button"
                  onClick={() => setArquivo(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : arquivoExistente ? (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <a
                  href={arquivoExistente.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {arquivoExistente.nome}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setUrlParaDeletar(arquivoExistente.url)
                    setArquivoExistente(null)
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file && perguntaArquivo)
                  setArquivo({ file, perguntaId: perguntaArquivo.id })
              }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {jaEnviouEm && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            Você já enviou sua avaliação em{' '}
            <strong>{new Date(jaEnviouEm).toLocaleDateString('pt-BR')}</strong>.
            Você pode atualizar suas respostas abaixo.
          </p>
        </div>
      )}
      <div className="grid grid-cols-12 gap-8">
        <Nav>
          {categoriasAtivas.map(({ cat, titulo, icon: Icon }) => (
            <NavItem
              key={cat}
              title={titulo}
              icon={Icon}
              link={`#cat-${cat}`}
            />
          ))}
          <NavItem title="Enviar" icon={Send} link="#enviar-section" />
        </Nav>

        <div className="col-span-full lg:col-start-4">
          <div className="flex flex-col gap-6">
            {categoriasAtivas.map(({ cat, titulo, perguntas: pCat }) => (
              <CardForm key={cat} title={titulo} sectionId={`cat-${cat}`}>
                <div className="flex flex-col divide-y divide-zinc-100">
                  {pCat.map(renderPergunta)}
                </div>
              </CardForm>
            ))}

            <Card
              id="enviar-section"
              className="w-full px-3 pt-8 text-zinc-700"
            >
              <CardContent className="flex w-full flex-col gap-3">
                <span className="text-2xl font-bold">
                  {jaEnviouEm ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
                </span>
                <p className="text-sm text-zinc-500">
                  Suas respostas são confidenciais e ficam registradas somente
                  para a dirigência.
                </p>
                <div className="flex items-center gap-5 py-5">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-10 w-40"
                  >
                    {submitting
                      ? jaEnviouEm
                        ? 'Atualizando...'
                        : 'Enviando...'
                      : jaEnviouEm
                        ? 'Atualizar'
                        : 'Enviar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
