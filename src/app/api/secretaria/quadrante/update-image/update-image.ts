import type { UpdateQuadranteData } from './route'

import type { Value_Quadrante as valueQuadrante } from '@/enums'
import { prisma } from '@/lib/prisma'

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
