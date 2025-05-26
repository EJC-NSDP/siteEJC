import type { valueStatus } from '@/@types/enums'
import { prisma } from '@/lib/prisma'

export type Status = {
  id: valueStatus
  status: string
}

export async function getStatus() {
  const status: Status[] = await prisma.domainStatus.findMany({
    select: {
      id: true,
      status: true,
    },
  })

  return status
}
