import { prisma } from '@/lib/prisma'
import type { updateCartaVirtualRouteProps } from './route'

export async function updateCartaPrinted({
  id,
  cartaStatus,
}: updateCartaVirtualRouteProps) {
  console.log(id, cartaStatus)
  return await prisma.carta.update({
    data: {
      isPrinted: cartaStatus,
    },
    where: {
      id,
    },
  })
}
