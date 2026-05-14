'use client'

import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'
import { saveAs } from 'file-saver'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { fetchEncontristaCarroAction } from '@/app/(app)/admin/externa/(tios externa)/alocacao-carros/actions'
import {
  calcIdade,
  resolveEndereco,
  resolveObservacoes,
  statusToDias,
  type EncontristaCarroData,
} from '@/utils/carro-helpers'

import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface PrintCarroDocxProps {
  idCarro: string
  numeroCarro: number
  tios: string
  externa: string
}

const PAGE_WIDTH = 9638
const HEADER_FILL = 'D9D9D9'
const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
const borders = { top: border, bottom: border, left: border, right: border }

function labelValor(
  label: string,
  valor: string | null | undefined,
): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label} `, bold: true }),
      new TextRun({ text: valor || '—' }),
    ],
    spacing: { after: 60 },
  })
}

function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: HEADER_FILL, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size: 18 })],
      }),
    ],
  })
}

function dataCell(text: string | null | undefined, width: number): TableCell {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: text ?? '—', size: 18 })],
      }),
    ],
  })
}

function sectionHeader(text: string): Table {
  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: [PAGE_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: PAGE_WIDTH, type: WidthType.DXA },
            shading: { fill: HEADER_FILL, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text, bold: true, size: 18 })],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function spacer(after = 120): Paragraph {
  return new Paragraph({ text: '', spacing: { after } })
}

function buildEncontristaPage(
  encontrista: EncontristaCarroData,
  isLast: boolean,
): (Paragraph | Table)[] {
  const { pessoa } = encontrista

  const nomeCompleto = `${pessoa.nome.trim()} ${pessoa.sobrenome.trim()}`

  const idade = calcIdade(pessoa.encontreiro?.dataNasc)
  const endereco = resolveEndereco(encontrista)
  const dias = statusToDias(encontrista.idStatus)
  const obs = resolveObservacoes(encontrista)

  const col1 = Math.floor(PAGE_WIDTH / 3)
  const col2 = Math.floor(PAGE_WIDTH / 3)
  const col3 = PAGE_WIDTH - col1 - col2
  const half = Math.floor(PAGE_WIDTH / 2)

  const blocks: (Paragraph | Table)[] = []

  blocks.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: nomeCompleto,
          bold: true,
          underline: {},
          size: 26,
        }),
      ],
    }),
  )

  blocks.push(labelValor('Apelido:', pessoa.apelido))
  blocks.push(labelValor('Celular:', pessoa.celular))
  blocks.push(labelValor('Idade:', idade))
  blocks.push(labelValor('Endereço:', endereco))
  blocks.push(labelValor('Dias que vai pro EJC:', dias))

  blocks.push(spacer(160))

  blocks.push(sectionHeader('Contato de Emergência 1'))
  blocks.push(
    new Table({
      width: { size: PAGE_WIDTH, type: WidthType.DXA },
      columnWidths: [col1, col2, col3],
      rows: [
        new TableRow({
          children: [
            headerCell('Nome', col1),
            headerCell('Celular', col2),
            headerCell('Parentesco', col3),
          ],
        }),
        new TableRow({
          children: [
            dataCell(encontrista.nomeContato1, col1),
            dataCell(encontrista.telContato1, col2),
            dataCell(encontrista.parentescoContato1, col3),
          ],
        }),
      ],
    }),
  )
  blocks.push(spacer(160))

  blocks.push(sectionHeader('Contato de Emergência 2'))
  blocks.push(
    new Table({
      width: { size: PAGE_WIDTH, type: WidthType.DXA },
      columnWidths: [col1, col2, col3],
      rows: [
        new TableRow({
          children: [
            headerCell('Nome', col1),
            headerCell('Celular', col2),
            headerCell('Parentesco', col3),
          ],
        }),
        new TableRow({
          children: [
            dataCell(encontrista.nomeContato2, col1),
            dataCell(encontrista.telContato2, col2),
            dataCell(encontrista.parentescoContato2, col3),
          ],
        }),
      ],
    }),
  )
  blocks.push(spacer(160))

  blocks.push(sectionHeader('Foi indicado por'))
  blocks.push(
    new Table({
      width: { size: PAGE_WIDTH, type: WidthType.DXA },
      columnWidths: [half, PAGE_WIDTH - half],
      rows: [
        new TableRow({
          children: [
            headerCell('Nome', half),
            headerCell('Celular', PAGE_WIDTH - half),
          ],
        }),
        new TableRow({
          children: [
            dataCell(encontrista.indicadoPorNome, half),
            dataCell(encontrista.indicadoPorTel, PAGE_WIDTH - half),
          ],
        }),
      ],
    }),
  )
  blocks.push(spacer(160))

  blocks.push(sectionHeader('Informações adicionais'))
  blocks.push(spacer(60))

  const statusPaisLabel =
    encontrista.idStatusPais === 'sim'
      ? 'Sim'
      : encontrista.idStatusPais === 'nao'
        ? 'Não'
        : 'N/A'

  blocks.push(labelValor('Pais são divorciados?', statusPaisLabel))
  if (encontrista.obsExternaLocalizacao) {
    blocks.push(
      labelValor('Local de saída na sexta:', encontrista.obsExternaLocalizacao),
    )
  }

  blocks.push(labelValor('Observações relevantes:', obs))

  if (!isLast) {
    blocks.push(new Paragraph({ children: [new PageBreak()] }))
  }

  return blocks
}

export function PrintEncontristaCarroDocx({
  idCarro,
  numeroCarro,
  tios,
  externa,
}: PrintCarroDocxProps) {
  const [loading, setLoading] = useState(false)

  async function generateDocx() {
    setLoading(true)
    try {
      const encontristas = await fetchEncontristaCarroAction(idCarro)

      const children: (Paragraph | Table)[] = []
      encontristas.forEach((encontrista, index) => {
        const isLast = index === encontristas.length - 1
        buildEncontristaPage(encontrista, isLast).forEach((block) =>
          children.push(block),
        )
      })

      const document = new Document({
        sections: [
          {
            properties: {
              page: {
                size: { width: 11906, height: 16838 },
                margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
              },
            },
            children,
          },
        ],
        styles: {
          default: {
            document: {
              run: { font: 'Arial', size: 20 },
            },
          },
        },
      })

      const blob = await Packer.toBlob(document)
      saveAs(blob, `Carro ${numeroCarro} - ${tios} - ${externa}.docx`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="p-0"
          onClick={generateDocx}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="text-tertiary h-4 w-4 animate-spin" />
          ) : (
            <Download className="text-tertiary h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="w-32 text-center">
        Baixar ficha do carro
      </TooltipContent>
    </Tooltip>
  )
}
