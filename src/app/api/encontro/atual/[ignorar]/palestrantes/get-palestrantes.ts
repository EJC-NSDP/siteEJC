import { prisma } from '@/lib/prisma'
import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

export interface PalestraEncontro {
  idPalestra: string
  nomePalestrante: string | null
}

export async function getPalestrantesAtual(): Promise<PalestraEncontro[]> {
  const currentEncontro = await getCurrentEncontro()

  if (!currentEncontro) return []

  const palestrantes = await prisma.palestrantes.findMany({
    select: {
      nome: true,
      palestra: {
        select: {
          id: true,
        },
      },
    },
    where: {
      idEncontro: currentEncontro.id,
    },
    orderBy: {
      order: 'asc',
    },
  })

  return palestrantes.map((palestrante) => {
    return {
      idPalestra: palestrante.palestra.id.toString(),
      nomePalestrante: palestrante.nome,
    }
  })
}
