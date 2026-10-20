'use client'

import { FileText, List, Lock, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/axios'

type CategoriaAvaliacao =
  | 'SUA_EQUIPE'
  | 'CANDIDATOS'
  | 'O_ENCONTRAO'
  | 'PARA_O_FUTURO'
  | 'DIRIGENCIA'
  | 'OUTROS'

const CATEGORIAS: { value: CategoriaAvaliacao; label: string }[] = [
  { value: 'SUA_EQUIPE', label: 'Sua Equipe' },
  { value: 'CANDIDATOS', label: 'Candidatos' },
  { value: 'O_ENCONTRAO', label: 'O Encontrão' },
  { value: 'PARA_O_FUTURO', label: 'Para o Futuro' },
  { value: 'DIRIGENCIA', label: 'Dirigência' },
  { value: 'OUTROS', label: 'Outros' },
]

interface Pergunta {
  id: string
  ordem: number
  chave: string
  texto: string
  descricao: string | null
  tipo: 'TEXTO_LONGO' | 'INDICACOES' | 'ARQUIVO'
  categoria: CategoriaAvaliacao
  removivel: boolean
  ativo: boolean
}

const tipoLabel: Record<
  Pergunta['tipo'],
  { label: string; icon: React.ElementType }
> = {
  TEXTO_LONGO: { label: 'Texto longo', icon: FileText },
  INDICACOES: { label: 'Indicações com busca', icon: List },
  ARQUIVO: { label: 'Upload de arquivo', icon: Upload },
}

export function PerguntasEditor({
  perguntas: initial,
}: {
  perguntas: Pergunta[]
}) {
  const [perguntas, setPerguntas] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)

  async function handleSave(pergunta: Pergunta) {
    setSaving(pergunta.id)
    try {
      await api.put('avaliacao/perguntas', {
        id: pergunta.id,
        texto: pergunta.texto,
        descricao: pergunta.descricao,
        ativo: pergunta.ativo,
        categoria: pergunta.categoria,
      })
      toast.success('Pergunta salva.')
    } catch {
      toast.error('Erro ao salvar pergunta.')
    } finally {
      setSaving(null)
    }
  }

  function update(id: string, field: keyof Pergunta, value: string | boolean) {
    setPerguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {perguntas.map((pergunta) => {
        const { label, icon: Icon } = tipoLabel[pergunta.tipo]
        return (
          <Card key={pergunta.id} className="w-full text-zinc-700">
            <CardContent className="flex flex-col gap-4 p-5">
              {/* Header da pergunta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-400">
                    #{pergunta.ordem}
                  </span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    {label}
                  </Badge>
                  {!pergunta.removivel && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      Funcionalidade fixa
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id={`ativo-${pergunta.id}`}
                    checked={pergunta.ativo}
                    disabled={!pergunta.removivel}
                    onCheckedChange={(v) => update(pergunta.id, 'ativo', v)}
                  />
                  <Label
                    htmlFor={`ativo-${pergunta.id}`}
                    className="cursor-pointer text-sm text-zinc-500"
                  >
                    Ativa
                  </Label>
                </div>
              </div>

              {/* Texto da pergunta */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-zinc-500">
                  Texto da pergunta
                </Label>
                <Textarea
                  value={pergunta.texto}
                  rows={2}
                  onChange={(e) => update(pergunta.id, 'texto', e.target.value)}
                  className="resize-none text-sm"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-zinc-500">
                  Descrição / subtexto
                </Label>
                <Input
                  value={pergunta.descricao ?? ''}
                  onChange={(e) =>
                    update(pergunta.id, 'descricao', e.target.value)
                  }
                  placeholder="Opcional"
                  className="text-sm"
                />
              </div>

              {/* Categoria */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-zinc-500">Categoria</Label>
                <Select
                  value={pergunta.categoria}
                  disabled={!pergunta.removivel}
                  onValueChange={(v) => update(pergunta.id, 'categoria', v)}
                >
                  <SelectTrigger className="text-sm">
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
              </div>
            </CardContent>

            <CardFooter className="flex w-full justify-end gap-4 p-5 pt-0">
              <Button
                className="h-10 w-40"
                disabled={saving === pergunta.id}
                onClick={() => handleSave(pergunta)}
              >
                {saving === pergunta.id ? 'Salvando...' : 'Salvar'}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
