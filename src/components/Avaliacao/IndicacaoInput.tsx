'use client'

import { Plus, Trash2, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/lib/axios'

interface EncontreiroResult {
  idPessoa: string
  pessoa: {
    nome: string
    sobrenome: string
    apelido: string | null
    avatarUrl: string | null
  }
}

interface Equipe {
  equipeValue: string
  equipeLabel: string
}

export interface IndicacaoItem {
  uid: string
  idEncontreiro: string
  nomeDisplay: string
  avatarUrl: string | null
  equipeIndicada: string
  avaliacao: string
}

interface IndicacaoInputProps {
  equipes: Equipe[]
  value: IndicacaoItem[]
  onChange: (indicacoes: IndicacaoItem[]) => void
}

export function IndicacaoInput({
  equipes,
  value,
  onChange,
}: IndicacaoInputProps) {
  return (
    <div className="flex flex-col gap-4">
      {value.map((item) => (
        <IndicacaoRow
          key={item.uid}
          item={item}
          equipes={equipes}
          onChange={(updated) =>
            onChange(value.map((v) => (v.uid === item.uid ? updated : v)))
          }
          onRemove={() => onChange(value.filter((v) => v.uid !== item.uid))}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-fit"
        onClick={() =>
          onChange([
            ...value,
            {
              uid: crypto.randomUUID(),
              idEncontreiro: '',
              nomeDisplay: '',
              avatarUrl: null,
              equipeIndicada: '',
              avaliacao: '',
            },
          ])
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar indicação
      </Button>
    </div>
  )
}

function IndicacaoRow({
  item,
  equipes,
  onChange,
  onRemove,
}: {
  item: IndicacaoItem
  equipes: Equipe[]
  onChange: (item: IndicacaoItem) => void
  onRemove: () => void
}) {
  const [query, setQuery] = useState(item.nomeDisplay)
  const [results, setResults] = useState<EncontreiroResult[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (item.idEncontreiro) return
    if (query.length < 2) {
      setResults([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const res = await api.get<EncontreiroResult[]>(
        `encontreiro/search?q=${encodeURIComponent(query)}`,
      )
      setResults(res.data)
      setOpen(true)
    }, 300)
  }, [query, item.idEncontreiro])

  function selectEncontreiro(e: EncontreiroResult) {
    const nome = `${e.pessoa.nome} ${e.pessoa.sobrenome}${e.pessoa.apelido ? ` (${e.pessoa.apelido})` : ''}`
    onChange({
      ...item,
      idEncontreiro: e.idPessoa,
      nomeDisplay: nome,
      avatarUrl: e.pessoa.avatarUrl,
    })
    setQuery(nome)
    setResults([])
    setOpen(false)
  }

  function clearSelection() {
    onChange({ ...item, idEncontreiro: '', nomeDisplay: '', avatarUrl: null })
    setQuery('')
    setResults([])
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-start gap-2">
        {/* Typeahead */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2">
            {item.idEncontreiro && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={item.avatarUrl ?? ''} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <Input
              placeholder="Buscar encontreiro por nome ou apelido..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                if (item.idEncontreiro) clearSelection()
              }}
              className="w-full"
            />
          </div>
          {open && results.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg">
              {results.map((e) => (
                <li
                  key={e.idPessoa}
                  className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-zinc-50"
                  onMouseDown={() => selectEncontreiro(e)}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={e.pessoa.avatarUrl ?? ''} />
                    <AvatarFallback>{e.pessoa.nome[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {e.pessoa.nome} {e.pessoa.sobrenome}
                    {e.pessoa.apelido && (
                      <span className="ml-1 text-zinc-400">
                        ({e.pessoa.apelido})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Equipe */}
        <Select
          value={item.equipeIndicada}
          onValueChange={(v) => onChange({ ...item, equipeIndicada: v })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Equipe" />
          </SelectTrigger>
          <SelectContent>
            {equipes.map((eq) => (
              <SelectItem key={eq.equipeValue} value={eq.equipeValue}>
                {eq.equipeLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      {/* Avaliação */}
      <Textarea
        placeholder="Avaliação da pessoa indicada..."
        value={item.avaliacao}
        onChange={(e) => onChange({ ...item, avaliacao: e.target.value })}
        rows={3}
      />
    </div>
  )
}
