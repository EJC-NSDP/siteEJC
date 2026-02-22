import type { updateCartaVirtualRouteProps } from './route'

import { prisma } from '@/lib/prisma'

export async function updateCartaPrinted({
  id,
  cartaStatus,
}: updateCartaVirtualRouteProps) {
  return await prisma.carta.update({
    data: {
      isPrinted: cartaStatus,
    },
    where: {
      id,
    },
  })
}
