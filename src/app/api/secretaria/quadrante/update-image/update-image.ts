import type { Value_Quadrante as valueQuadrante } from '@/enums'
import { prisma } from '@/lib/prisma'

import type { UpdateQuadranteData } from './route'

export async function updateImage({ value, imageUrl }: UpdateQuadranteData) {
  const valueTransformed = value as valueQuadrante
  return await prisma.quadrante.update({
    where: {
      value: valueTransformed,
    },
    data: {
      imageUrl,
    },
  })
}
