'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

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
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/axios'

type Categoria =
  | 'SUA_EQUIPE'
  | 'CANDIDATOS'
  | 'O_ENCONTRAO'
  | 'PARA_O_FUTURO'
  | 'DIRIGENCIA'
  | 'OUTROS'

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'SUA_EQUIPE', label: 'Sua Equipe' },
  { value: 'CANDIDATOS', label: 'Candidatos' },
  { value: 'O_ENCONTRAO', label: 'O Encontrão' },
  { value: 'PARA_O_FUTURO', label: 'Para o Futuro' },
  { value: 'DIRIGENCIA', label: 'Dirigência' },
  { value: 'OUTROS', label: 'Outros' },
]

export function NovaPerguntaForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    chave: '',
    texto: '',
    descricao: '',
    categoria: 'OUTROS' as Categoria,
  })

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.chave.trim() || !form.texto.trim()) {
      toast.error('Preencha a chave e o texto da pergunta.')
      return
    }
    setSaving(true)
    try {
      await api.post('avaliacao/perguntas', {
        chave: form.chave.trim(),
        texto: form.texto.trim(),
        descricao: form.descricao.trim() || null,
        tipo: 'TEXTO_LONGO',
        categoria: form.categoria,
      })
      toast.success('Pergunta criada com sucesso.')
      router.push('/admin/dirigente/avaliacao/perguntas')
      router.refresh()
    } catch {
      toast.error('Erro ao criar pergunta. Verifique se a chave é única.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full text-zinc-700">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-zinc-500">Chave única</Label>
            <Input
              value={form.chave}
              onChange={(e) => set('chave', e.target.value)}
              placeholder="ex: avaliacao_geral"
              className="font-mono text-sm"
            />
            <p className="text-xs text-zinc-400">
              Identificador interno, sem espaços, único no sistema.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs text-zinc-500">Texto da pergunta</Label>
            <Textarea
              rows={3}
              value={form.texto}
              onChange={(e) => set('texto', e.target.value)}
              placeholder="Como foi...?"
              className="resize-none text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs text-zinc-500">
              Descrição / subtexto
            </Label>
            <Input
              value={form.descricao}
              onChange={(e) => set('descricao', e.target.value)}
              placeholder="Opcional"
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs text-zinc-500">Categoria</Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => set('categoria', v)}
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
          <Button type="submit" className="h-10 w-40" disabled={saving}>
            {saving ? 'Criando...' : 'Criar pergunta'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
