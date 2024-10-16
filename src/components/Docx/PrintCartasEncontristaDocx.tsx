'use client'

import type { EncontristaIdentification } from '@/app/api/encontrista/identification/[slug]/get-identification'
import type { Carta } from '@/app/api/export/carta/[slug]/get-encontrista-cartas'
import { api } from '@/lib/axios'
import { dividirEmParagrafos } from '@/utils/dividir-paragrafos'
import {
  AlignmentType,
  Document,
  Header,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
} from 'docx'
import { saveAs } from 'file-saver'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface PrintCartasEncontrista {
  cartas: Carta[]
  encontrista: EncontristaIdentification
}

async function createCarta(carta: Carta, separator: boolean) {
  const doc: Paragraph[] = []
  const conteudoDivido = dividirEmParagrafos(carta.conteudo)
  doc.push(new Paragraph(`${carta.para},`))
  await Promise.all(
    conteudoDivido.map(async (paragrafo) => {
      doc.push(new Paragraph(paragrafo))
    }),
  )
  doc.push(new Paragraph(carta.de))
  if (separator) {
    doc.push(new Paragraph(''))
    doc.push(
      new Paragraph(
        '--------------------------------------------------------------------',
      ),
    )
    doc.push(new Paragraph(''))
  }

  return doc
}

export function PrintCartasEncontristaDocx({
  cartas,
  encontrista,
}: PrintCartasEncontrista) {
  const [hasCartas, setHasCartas] = useState(cartas.length !== 0)
  const [filteredCartas, setFilteredCartas] = useState<Carta[] | null>(null)
  const header = `${encontrista.nome} ${encontrista.sobrenome} - ${encontrista.corCirculo}`

  useEffect(() => {
    const newFilteredCartas = cartas.filter((carta) => !carta.isPrinted)
    setFilteredCartas(newFilteredCartas)
    setHasCartas(newFilteredCartas.length !== 0)
  }, [cartas, setHasCartas])

  async function getUnprintedCartas() {
    const doc: Paragraph[] = []
    if (filteredCartas) {
      await Promise.all(
        filteredCartas.map(async (carta, index) => {
          const separate = !!(
            index + 1 < filteredCartas.length && cartas.length !== 1
          )

          const formatedCarta = await createCarta(carta, separate)
          formatedCarta.forEach((paragrah) => {
            doc.push(paragrah)
          })
        }),
      )
    }

    return doc
  }
  async function generateDocx() {
    const unprintedCarta = await getUnprintedCartas()
    const document = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              // The standard default header on every page or header on odd pages when the 'Different Odd & Even Pages' option is activated
              children: [
                // {
                //   text: header,
                //   alignment: AlignmentType.END,
                // }
                new Paragraph({
                  children: [
                    new TextRun({
                      children: [header, ' #', PageNumber.CURRENT],
                    }),
                  ],
                  alignment: AlignmentType.END,
                }),
              ],
            }),
          },
          children: unprintedCarta,
        },
      ],
      title: `cartas-${encontrista.nome}.docx`,
      styles: {
        default: {
          document: {
            run: {
              size: '11pt',
              font: 'Nunito',
            },
          },
        },
      },
    })

    Packer.toBlob(document).then((blob) => {
      saveAs(blob, `cartas-${encontrista.nome}.docx`)
    })

    cartas.map(async (carta) => {
      return carta
        ? await api.patch('carta/update-carta-virtual/', {
            id: carta.id,
            cartaStatus: true,
          })
        : null
    })
  }
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="ghost"
          className="p-0 disabled:cursor-auto disabled:opacity-20"
          disabled={!hasCartas}
          onClick={generateDocx}
        >
          <Download className="h-4 w-4 text-tertiary" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="w-32 text-center">
        Baixar cartas virtuais
      </TooltipContent>
    </Tooltip>
  )
}
