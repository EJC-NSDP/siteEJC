'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import * as XLSX from 'xlsx'

import type { EncontristaRecepcaoData } from '@/app/api/recepcao/encontristas/get-encontristas-recepcao'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const HEADERS = [
  '✓',
  'Nome completo',
  'Círculo',
  'Família Confirmada',
  'Contato 1',
  'Contato 2',
  'Tio(s) de Externa',
]

function toRow(e: EncontristaRecepcaoData): string[] {
  const nomeCompleto = `${e.nome} ${e.sobrenome}${e.apelido ? ` (${e.apelido})` : ''}`
  return [
    '',
    nomeCompleto,
    e.corCirculo ?? '—',
    e.familiaOk ? 'Sim' : 'Não',
    e.nomeContato1 || '—',
    e.nomeContato2 || '—',
    e.tiosExterna ?? '—',
  ]
}

export function PrintEncontristasRecepcaoXls() {
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleExport() {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/recepcao/encontristas?all=true')
      const encontristas: EncontristaRecepcaoData[] = await res.json()

      const data = [HEADERS, ...encontristas.map(toRow)]

      const ws = XLSX.utils.aoa_to_sheet(data)

      // Largura das colunas
      ws['!cols'] = [
        { wch: 4 }, // ✓
        { wch: 35 }, // Nome
        { wch: 12 }, // Círculo
        { wch: 10 }, // Família
        { wch: 28 }, // Contato 1
        { wch: 28 }, // Contato 2
        { wch: 30 }, // Tios
      ]

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Encontristas')
      XLSX.writeFile(wb, 'lista-encontristas-recepcao.xlsx')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exportar lista
        </Button>
      </TooltipTrigger>
      <TooltipContent>Baixar lista de encontristas em Excel</TooltipContent>
    </Tooltip>
  )
}
