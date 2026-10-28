'use client'

import { User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
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

export interface PessoaSelecionada {
  idPessoa: string
  nome: string
  avatarUrl: string | null
}

interface Props {
  value: PessoaSelecionada | null
  onChange: (v: PessoaSelecionada | null) => void
  excluir?: string[]
  placeholder?: string
}

export function PessoaSearchInput({
  value,
  onChange,
  excluir = [],
  placeholder = 'Buscar por nome ou apelido...',
}: Props) {
  const [query, setQuery] = useState(value?.nome ?? '')
  const [results, setResults] = useState<EncontreiroResult[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    if (!value) setQuery('')
    else setQuery(value.nome)
  }, [value])

  useEffect(() => {
    if (value) return
    if (query.length < 2) {
      setResults((prev) => (prev.length === 0 ? prev : []))
      setOpen(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const res = await api.get<EncontreiroResult[]>(
        `encontreiro/search?q=${encodeURIComponent(query)}`,
      )
      if (valueRef.current) return
      setResults(res.data.filter((r) => !excluir.includes(r.idPessoa)))
      setOpen(res.data.length > 0)
    }, 300)
  }, [query, value, excluir])

  function select(e: EncontreiroResult) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const nome = `${e.pessoa.nome} ${e.pessoa.sobrenome}${e.pessoa.apelido ? ` (${e.pessoa.apelido})` : ''}`
    onChange({ idPessoa: e.idPessoa, nome, avatarUrl: e.pessoa.avatarUrl })
    setResults([])
    setOpen(false)
  }

  function clear() {
    onChange(null)
    setResults([])
    setOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={value?.avatarUrl ?? undefined} />
          <AvatarFallback>
            <User className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (value) onChange(null)
          }}
          className="flex-1"
        />
        <div className="w-4 shrink-0">
          {value && (
            <button
              type="button"
              onClick={clear}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg">
          {results.map((e) => (
            <li
              key={e.idPessoa}
              className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-zinc-50"
              onMouseDown={() => select(e)}
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={e.pessoa.avatarUrl ?? undefined} />
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
  )
}
