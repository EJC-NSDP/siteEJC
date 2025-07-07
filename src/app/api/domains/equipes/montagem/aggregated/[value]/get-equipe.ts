import { prisma } from '@/lib/prisma'

export interface EquipeMontagemAggregated {
  value: string
  label: string
  total: number
  coordDone: boolean
  content: string[]
}

const salaEquipes = [
  'apresentacao',
  'boa_vontade',
  'tio_aparente',
  'tio_circulo',
  'tio_secreto',
]
const rosaEquipes = ['compras', 'externa', 'meditacao', 'recepcao', 'vigilia']
const tioEquipes = ['tio_aparente', 'tio_circulo', 'tio_secreto']

// Função auxiliar para equipes agrupadas (sala, rosa)

export async function getEquipe(
  value: string,
): Promise<EquipeMontagemAggregated> {
  const labelMap = Object.fromEntries(
    (
      await prisma.domainEquipes.findMany({
        select: { equipeValue: true, equipeLabel: true },
      })
    ).map((e) => [e.equipeValue, e.equipeLabel]),
  )

  async function createEquipeAgrupada(
    value: string,
    label: string,
    subequipes: string[],
  ): Promise<EquipeMontagemAggregated> {
    let total = 0
    let totalCoords = 0
    let totalTios = 0
    const contentLines: string[] = []

    for (const sub of subequipes) {
      const subTotal = await prisma.equipeMontagem.count({
        where: { valueEquipe: sub },
      })

      const subCoords = await prisma.equipeMontagem.count({
        where: {
          valueEquipe: sub,
          coordenando: true,
        },
      })

      total += subTotal
      totalCoords += subCoords

      if (tioEquipes.includes(sub)) {
        totalTios += subTotal
      } else {
        const nome = labelMap[sub] ?? sub
        contentLines.push(`${nome}: ${subTotal}`)
      }
    }

    if (totalTios > 0) {
      contentLines.push(`Tios de Círculo: ${totalTios}`)
    }

    return {
      value,
      label,
      total,
      coordDone: totalCoords >= 2,
      content: contentLines,
    }
  }

  // Sala ou Rosa
  if (value === 'sala') {
    return await createEquipeAgrupada('sala', 'Sala', salaEquipes)
  }

  if (value === 'rosa') {
    return await createEquipeAgrupada('rosa', 'Rosa', rosaEquipes)
  }

  // Sem equipe
  if (value === 'sem_equipe') {
    const totalEncontreirosSemEquipe = await prisma.encontreiro.count({
      where: {
        equipeMontagem: null,
        NOT: {
          statusMontagem: 'INATIVO',
        },
      },
    })
    return {
      value,
      label: 'Sem equipe',
      total: totalEncontreirosSemEquipe,
      coordDone: false,
      content: [],
    }
  }

  // Equipe individual
  const totalCoords = await prisma.equipeMontagem.count({
    where: {
      valueEquipe: value,
      coordenando: true,
    },
  })

  const total = await prisma.equipeMontagem.count({
    where: {
      valueEquipe: value,
    },
  })

  const tropa = total - totalCoords
  const label = labelMap[value] ?? value

  return {
    value,
    label,
    total,
    coordDone: totalCoords >= 2,
    content: [`Coordenadores: ${totalCoords}`, `Tropa: ${tropa}`],
  }
}
