import { prisma } from '@/lib/prisma'

export type Pasta = {
  value: string
  label: string
}

export async function getPastas(): Promise<Pasta[]> {
  return await prisma.domainPasta.findMany({
    select: {
      value: true,
      label: true,
    },
    orderBy: {
      label: 'asc',
    },
  })
}
