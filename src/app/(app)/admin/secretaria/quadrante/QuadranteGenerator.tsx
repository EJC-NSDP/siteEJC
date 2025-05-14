'use client'

import type {
  CirculoQuadrante,
  EquipeBPsQuadrante,
  EquipePalestrantesQuadrante,
  EquipePastoraisQuadrante,
  EquipeQuadrante,
  EquipeTiosExternaQuadrante,
} from '@/@types/quadrante'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  idPertenceARosa,
  idPertenceASala,
  idPertenceATropa,
} from '@/utils/pertence'
import React, { useState } from 'react'
import { QuadranteCirculoPage } from './pageComponents/QuadranteCirculoPage'
import { QuadranteCoverPage } from './pageComponents/QuadranteCoverPage'
import { QuadranteEquipePage } from './pageComponents/QuadranteEquipePage'
import { QuadranteOnePage } from './pageComponents/QuadranteOnePage'
import { QuadrantePalestraPage } from './pageComponents/QuadrantePalestraPage'
import { QuadranteTiosExternaPage } from './pageComponents/QuadranteTiosExternaPage'
import { QuadranteTwoPage } from './pageComponents/QuadranteTwoPage'

interface QuadranteGeneratorProps {
  circulos: CirculoQuadrante[]
  equipes: EquipeQuadrante[]
  tiosExterna: EquipeTiosExternaQuadrante
  palestrantes: EquipePalestrantesQuadrante
  bonsPastores: EquipeBPsQuadrante
  pastorais: EquipePastoraisQuadrante
}

export function QuadranteGenerator({
  circulos,
  equipes,
  tiosExterna,
  palestrantes,
  bonsPastores,
  pastorais,
}: QuadranteGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [pages, setPages] = useState<React.ReactNode[]>([])

  async function generateQuadrante(pb: boolean) {
    setIsGenerating(true)
    const capas = {
      main: pb
        ? 'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160952/assets/quadrante/capas/capa-1_pdrmi8.png'
        : 'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160953/assets/quadrante/capas/capa-2_y4jlso.png',
      circulos: pb
        ? 'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160954/assets/quadrante/capas/capa-circulo-1_qhecds.png'
        : 'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160952/assets/quadrante/capas/capa-circulo-2_sasslw.png',
      equipes:
        'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160951/assets/quadrante/capas/capa-equipes_ajw3qo.png',
    }
    const cartas = {
      papa: 'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160936/assets/quadrante/cartas/cartaPapa_nsmwlp.png',
      padre:
        'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160936/assets/quadrante/cartas/cartaPadre_hmzd7b.png',
      diris:
        'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160934/assets/quadrante/cartas/cartaDiris_h1r7ra.png',
    }
    const cartazes = [
      'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160971/assets/quadrante/cartazes/Azul_apx53s.png',
      'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160974/assets/quadrante/cartazes/Laranja_cwk76r.png',
      'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160970/assets/quadrante/cartazes/Verde_yxtzxl.png',
      'https://res.cloudinary.com/ejc-nsdp/image/upload/v1747160971/assets/quadrante/cartazes/Vermelho_hwbb6y.png',
    ]
    const newPages: React.ReactNode[] = []
    const qtdPorPag = 10

    // Capa
    newPages.push(
      <QuadranteCoverPage key="cover" imageUrl={capas.main} alt="Capa" />,
    )

    // Cartas
    newPages.push(
      <QuadranteCoverPage key="papa" imageUrl={cartas.papa} alt="Carta Papa" />,
    )
    newPages.push(
      <QuadranteCoverPage
        key="padre"
        imageUrl={cartas.padre}
        alt="Carta Padre"
      />,
    )
    newPages.push(
      <QuadranteCoverPage
        key="dirigentes"
        imageUrl={cartas.diris}
        alt="Carta Diris"
      />,
    )

    // Círculos
    newPages.push(
      <QuadranteCoverPage
        key="capa-circulos"
        imageUrl={capas.circulos}
        alt="Capa Circulos"
      />,
    )

    circulos.forEach((circulo, index) => {
      const cartazUrl = cartazes[index]
      const membros = circulo.integrantes
      const total = membros.length
      const tamanhoCartaz = 4

      const qtdPorPagina = qtdPorPag

      const totalPaginas = Math.ceil(total / qtdPorPagina)
      const paginas = []

      for (let i = 0; i < totalPaginas; i++) {
        const start = i * qtdPorPagina
        const end = start + qtdPorPagina
        const integrantesPag = membros.slice(start, end)

        const isUltimaPaginaDeIntegrantes = i === totalPaginas - 1
        const espacosRestantes = qtdPorPagina - integrantesPag.length

        const deveIncluirCartaz =
          isUltimaPaginaDeIntegrantes && espacosRestantes >= tamanhoCartaz

        paginas.push(
          <QuadranteCirculoPage
            key={`${circulo.cor}-${i}`}
            title={`Círculo ${circulo.cor}`}
            circleColor={circulo.cor}
            integrantes={integrantesPag}
            cartazUrl={deveIncluirCartaz ? cartazUrl : undefined}
            isPb={pb}
          />,
        )
      }

      // Se não coube o cartaz na última página, adiciona uma nova só para ele
      const ultimaPagina = membros.length % qtdPorPagina
      const sobraEspacos = ultimaPagina === 0 ? 0 : qtdPorPagina - ultimaPagina
      const precisaDePaginaExtraProCartaz =
        cartazUrl && sobraEspacos < tamanhoCartaz

      if (precisaDePaginaExtraProCartaz) {
        paginas.push(
          <QuadranteCirculoPage
            key={`${circulo.cor}-cartaz`}
            title={`Círculo ${circulo.cor}`}
            circleColor={circulo.cor}
            integrantes={[]}
            cartazUrl={cartazUrl}
            isPb={pb}
          />,
        )
      }

      newPages.push(...paginas)
    })

    // Equipes

    newPages.push(
      <QuadranteCoverPage
        key="capa-equipes"
        imageUrl={capas.equipes}
        alt="Capa Equipes"
      />,
    )
    // Equipes com tropa
    const equipesTropa = equipes.filter((equipe) =>
      idPertenceATropa(equipe.value),
    )

    equipesTropa.forEach((equipe) => {
      const membros = equipe.integrantes
      const total = membros.length

      const qtdPorPagina = qtdPorPag

      const totalPaginas = Math.ceil(total / qtdPorPagina)

      for (let i = 0; i < totalPaginas; i++) {
        const start = i * qtdPorPagina
        const end = start + qtdPorPagina
        const integrantesPag = membros.slice(start, end)

        newPages.push(
          <QuadranteOnePage>
            <QuadranteEquipePage
              key={`${equipe.nome}-${i}`}
              title={equipe.nome}
              description={equipe.descricao}
              integrantes={integrantesPag}
            />
          </QuadranteOnePage>,
        )
      }
    })

    // Sala
    const equipesSala = equipes.filter((equipe) =>
      idPertenceASala(equipe.value),
    )

    newPages.push(
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Apresentação"
          title={`${equipesSala[0].nome} (Sala)`}
          description={equipesSala[0].descricao}
          integrantes={equipesSala[0].integrantes}
        />
        <QuadranteEquipePage
          key="BVs"
          title={`${equipesSala[1].nome} (Sala)`}
          description={equipesSala[1].descricao}
          integrantes={equipesSala[1].integrantes}
        />
      </QuadranteTwoPage>,
    )

    newPages.push(
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Tio Aparente"
          title={`${equipesSala[2].nome} (Sala)`}
          description={equipesSala[2].descricao}
          integrantes={equipesSala[2].integrantes}
        />
        <QuadranteEquipePage
          key="Tio Secreto"
          title={`${equipesSala[3].nome} (Sala)`}
          description={equipesSala[3].descricao}
          integrantes={equipesSala[3].integrantes}
        />
      </QuadranteTwoPage>,
    )

    // Rosa
    const equipesRosa = equipes.filter((equipe) =>
      idPertenceARosa(equipe.value),
    )

    newPages.push(
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Compras"
          title={`${equipesRosa[0].nome} (Rosa)`}
          description={equipesRosa[0].descricao}
          integrantes={equipesRosa[0].integrantes}
        />
        <QuadranteEquipePage
          key="Externa"
          title={`${equipesRosa[1].nome} (Rosa)`}
          description={equipesRosa[1].descricao}
          integrantes={equipesRosa[1].integrantes}
        />
      </QuadranteTwoPage>,
    )

    newPages.push(
      <QuadranteTwoPage>
        <QuadranteEquipePage
          key="Meditação"
          title={`${equipesRosa[2].nome} (Rosa)`}
          description={equipesRosa[2].descricao}
          integrantes={equipesRosa[2].integrantes}
        />
        <QuadranteEquipePage
          key="Recepção"
          title={`${equipesRosa[3].nome} (Rosa)`}
          description={equipesRosa[3].descricao}
          integrantes={equipesRosa[3].integrantes}
        />
      </QuadranteTwoPage>,
    )

    newPages.push(
      <QuadranteOnePage>
        <QuadranteEquipePage
          key="Vigília"
          title={`${equipesRosa[4].nome} (Rosa)`}
          description={equipesRosa[4].descricao}
          integrantes={equipesRosa[4].integrantes}
        />
      </QuadranteOnePage>,
    )

    // Dirigentes
    const dirigentes = equipes.filter((equipe) => equipe.value === 'dirigente')

    newPages.push(
      <QuadranteOnePage>
        <QuadranteEquipePage
          key="Dirigentes"
          title={dirigentes[0].nome}
          description={dirigentes[0].descricao}
          integrantes={dirigentes[0].integrantes}
        />
      </QuadranteOnePage>,
    )

    // Tios de Externa
    const totalTios = tiosExterna.integrantes.length
    const qtdTiosPorPagina = 28

    const totalPaginas = Math.ceil(totalTios / qtdTiosPorPagina)

    for (let i = 0; i < totalPaginas; i++) {
      const start = i * qtdTiosPorPagina
      const end = start + qtdTiosPorPagina
      const integrantesPag = tiosExterna.integrantes.slice(start, end)

      newPages.push(
        <QuadranteTiosExternaPage
          key="Tios de Externa"
          title={tiosExterna.nome}
          description={tiosExterna.descricao}
          integrantes={integrantesPag}
        />,
      )
    }

    // Palestrantes
    newPages.push(
      <QuadrantePalestraPage
        key="Palestrantes"
        title={palestrantes.nome}
        description={palestrantes.descricao}
        integrantes={palestrantes.integrantes}
      />,
    )

    // BPs

    newPages.push(
      <QuadranteOnePage>
        <QuadranteEquipePage
          key="BPs"
          title={bonsPastores.nome}
          description={bonsPastores.descricao}
          integrantes={bonsPastores.integrantes}
        />
      </QuadranteOnePage>,
    )

    // Pastorais
    console.log(pastorais)

    setPages(newPages)
    setIsGenerating(false)
  }

  return (
    <div className="flex justify-between pl-2">
      <div className="flex flex-col justify-start gap-8">
        <div className="mx-auto w-full">
          <label className="mb-2 block text-lg font-medium">
            Quadrante para colorir
          </label>
          <Button
            onClick={() => generateQuadrante(true)}
            disabled={isGenerating}
          >
            {isGenerating ? 'Gerando...' : 'Enviar'}
          </Button>
        </div>
        <div className="mx-auto w-full">
          <label className="mb-2 block text-lg font-medium">
            Quadrante Colorido
          </label>
          <Button
            onClick={() => generateQuadrante(false)}
            disabled={isGenerating}
          >
            {isGenerating ? 'Gerando...' : 'Enviar'}
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[800px] w-sheet">
        <div className="flex flex-col gap-2">
          {pages.map((page, index) => (
            <React.Fragment key={`page-${index}`}>{page}</React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
