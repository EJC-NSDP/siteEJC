import { prisma } from '@/lib/prisma'

export type Dom = {
  value: string
  label: string
}

export async function getDons(): Promise<Dom[]> {
  return await prisma.domainDom.findMany({
    select: {
      value: true,
      label: true,
    },
    orderBy: {
      label: 'asc',
    },
  })
}
