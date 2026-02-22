import type { updateCartaFisicaRouteProps } from './route'

import { prisma } from '@/lib/prisma'

export async function updateCartaFisica({
  id,
  cartasFisicas,
}: updateCartaFisicaRouteProps) {
  return await prisma.encontrista.update({
    data: {
      cartasFisicas,
    },
    where: {
      idPessoa: id,
    },
  })
}
