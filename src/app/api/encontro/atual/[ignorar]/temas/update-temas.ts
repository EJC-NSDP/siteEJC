import { prisma } from '@/lib/prisma'

import { getCurrentEncontro } from '../get-current-encontro/get-current-encontro'

import type { TemasEncontroData } from './get-temas'

export interface UpdateTemasProps {
  temaFantasia: string
  temaEspiritual: string
}

export async function updateTemas({
  temaFantasia,
  temaEspiritual,
}: UpdateTemasProps): Promise<TemasEncontroData | null> {
  const currentEncontro = await getCurrentEncontro()
  if (!currentEncontro) {
    return null
  }

  const temasUpdated = await prisma.encontro.update({
    where: {
      id: currentEncontro.id,
    },
    data: {
      temaFantasia,
      temaEspiritual,
    },
  })

  return {
    temaFantasia: temasUpdated.temaFantasia,
    temaEspiritual: temasUpdated.temaEspiritual,
  }
}
