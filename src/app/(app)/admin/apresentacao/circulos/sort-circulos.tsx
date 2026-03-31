'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { CirculosResponse } from '@/app/api/encontro/atual/[ignorar]/circulos/get-circulos'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/axios'

import { CardCirculo } from './card-circulo'
import {
  circulosOrdemScheme,
  type CirculoItem,
  type CirculosOrdemData,
} from './validators'

// ── mapeamento ─────────────────────────────────────────────────────────────

const COR_POR_ID: Record<number, string> = {
  1: 'Amarelo',
  2: 'Azul',
  3: 'Laranja',
  4: 'Verde',
  5: 'Vermelho',
}

// ── helpers ────────────────────────────────────────────────────────────────

function buildLists(response: CirculosResponse): {
  ativos: CirculoItem[]
  inativos: CirculoItem[]
} {
  const orderDigits = response.order.toString().split('').map(Number)
  const circuloById = Object.fromEntries(
    response.circulos.map((c) => [c.idCorCirculo, c]),
  )

  const ativos: CirculoItem[] = orderDigits
    .filter((digit) => circuloById[digit])
    .map((digit) => ({
      ...circuloById[digit],
      cor: COR_POR_ID[digit] ?? '',
      tioAparente: '',
      tioSecreto: '',
      ativo: true,
    }))

  const idsAtivos = new Set(orderDigits)

  const inativos: CirculoItem[] = response.circulos
    .filter((c) => !idsAtivos.has(c.idCorCirculo))
    .map((c) => ({
      ...c,
      cor: COR_POR_ID[c.idCorCirculo] ?? '',
      tioAparente: '',
      tioSecreto: '',
      ativo: false,
    }))

  return { ativos, inativos }
}

function buildOrder(ativos: CirculoItem[]): number {
  return Number(ativos.map((c) => c.idCorCirculo).join(''))
}

// sincroniza o form com o estado atual das duas listas
function syncForm(
  form: ReturnType<typeof useForm<CirculosOrdemData>>,
  ativos: CirculoItem[],
  inativos: CirculoItem[],
) {
  form.setValue('circulos', [...ativos, ...inativos])
}

// ── componente ─────────────────────────────────────────────────────────────

interface SortCirculosProps {
  circulosEncontro: CirculosResponse
  idEncontro: string
}

export function SortCirculos({
  circulosEncontro,
  idEncontro,
}: SortCirculosProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const initial = buildLists(circulosEncontro)
  const [ativos, setAtivos] = useState<CirculoItem[]>(initial.ativos)
  const [inativos, setInativos] = useState<CirculoItem[]>(initial.inativos)

  const form = useForm<CirculosOrdemData>({
    resolver: zodResolver(circulosOrdemScheme),
    defaultValues: { circulos: [...initial.ativos, ...initial.inativos] },
  })

  const { handleSubmit } = form

  // ── movimentação dentro dos ativos ──────────────────────────────────────

  function moveAtivoUp(index: number) {
    if (index === 0) return
    setAtivos((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      syncForm(form, next, inativos)
      return next
    })
  }

  function moveAtivoDown(index: number) {
    // último ativo → vira inativo, limpa tios
    if (index === ativos.length - 1) {
      const item = {
        ...ativos[index],
        ativo: false,
        tioAparente: '',
        tioSecreto: '',
      }
      const nextAtivos = ativos.slice(0, index)
      const nextInativos = [item, ...inativos]
      setAtivos(nextAtivos)
      setInativos(nextInativos)
      syncForm(form, nextAtivos, nextInativos)
      return
    }
    setAtivos((prev) => {
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      syncForm(form, next, inativos)
      return next
    })
  }

  // ── movimentação dentro dos inativos ────────────────────────────────────

  function moveInativoUp(index: number) {
    // primeiro inativo → vira ativo (vai para o fim dos ativos)
    if (index === 0) {
      const item = { ...inativos[0], ativo: true }
      const nextAtivos = [...ativos, item]
      const nextInativos = inativos.slice(1)
      setAtivos(nextAtivos)
      setInativos(nextInativos)
      syncForm(form, nextAtivos, nextInativos)
      return
    }
    setInativos((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      syncForm(form, ativos, next)
      return next
    })
  }

  function moveInativoDown(index: number) {
    if (index === inativos.length - 1) return
    setInativos((prev) => {
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      syncForm(form, ativos, next)
      return next
    })
  }

  // ── save ─────────────────────────────────────────────────────────────────

  async function handleSave(formData: CirculosOrdemData) {
    setIsUpdating(true)
    try {
      const order = buildOrder(ativos)
      await api.put('encontro/atual/1/circulos', {
        order,
        circulos: formData.circulos,
      })
      toast.success('Ordenação salva!')
    } catch {
      toast.error('Erro ao salvar a ordenação.')
    } finally {
      setIsUpdating(false)
    }
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-8">
        {/* ── Neste Encontro ── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-700">
              Neste Encontro
            </h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              {ativos.length}
            </span>
          </div>

          {ativos.length === 0 && (
            <Card className="flex items-center justify-center p-6 text-sm text-zinc-400">
              Nenhum círculo neste encontro.
            </Card>
          )}

          <div className="flex flex-col gap-3">
            {ativos.map((field, index) => (
              <CardCirculo
                key={field.id}
                index={index}
                totalAtivos={ativos.length}
                totalFora={inativos.length}
                isAtivo
                idEncontro={idEncontro}
                control={form.control}
                onMoveUp={() => moveAtivoUp(index)}
                onMoveDown={() => moveAtivoDown(index)}
              />
            ))}
          </div>
        </section>

        {/* ── Fora deste Encontro ── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-500">
              Fora deste Encontro
            </h2>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
              {inativos.length}
            </span>
          </div>

          {inativos.length === 0 && (
            <Card className="flex items-center justify-center p-6 text-sm text-zinc-400">
              Todos os círculos estão neste encontro.
            </Card>
          )}

          <div className="flex flex-col gap-3">
            {inativos.map((field, index) => {
              const globalIndex = ativos.length + index
              return (
                <CardCirculo
                  key={field.id}
                  index={globalIndex}
                  totalAtivos={ativos.length}
                  totalFora={inativos.length}
                  isAtivo={false}
                  idEncontro={idEncontro}
                  control={form.control}
                  onMoveUp={() => moveInativoUp(index)}
                  onMoveDown={() => moveInativoDown(index)}
                />
              )
            })}
          </div>
        </section>

        {/* ── Salvar ── */}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isUpdating} className="w-40">
            {isUpdating ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
