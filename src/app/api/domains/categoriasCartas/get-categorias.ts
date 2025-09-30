import { prisma } from '@/lib/prisma'

export type CategoriaCartas = {
  id: string
  label: string
}

export async function getCategoriasCartas() {
  const categoriasCartas: CategoriaCartas[] =
    await prisma.domainCategoriasCartas.findMany({
      select: {
        id: true,
        label: true,
      },
      orderBy: {
        label: 'asc',
      }
    })

  return categoriasCartas
}
