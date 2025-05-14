import type {
  EquipePalestrantesQuadrante,
  PalestranteQuadrante,
} from '@/@types/quadrante'
import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '@/utils/fetch-this-encontro'

export async function getPalestranteQuadrante(): Promise<EquipePalestrantesQuadrante | null> {
  const encontro = await getCurrentEncontro()

  const equipe = await prisma.domainEquipes.findUnique({
    select: {
      equipeLabel: true,
      equipeValue: true,
      description: true,
    },
    where: {
      equipeValue: 'palestrante',
    },
  })

  if (!encontro || !equipe) return null

  const palestrantes = await prisma.palestrantes.findMany({
    where: {
      idEncontro: encontro.id,
    },
    orderBy: {
      order: 'asc',
    },
    select: {
      nome: true,
      palestra: {
        select: {
          nome: true,
        },
      },
    },
  })

  const integrantes: PalestranteQuadrante[] = palestrantes.map(
    (palestrante) => {
      return {
        nome: palestrante.nome || '',
        tema: palestrante.palestra.nome,
      }
    },
  )

  return {
    nome: equipe.equipeLabel,
    descricao: equipe.description || '',
    integrantes,
  }
}
