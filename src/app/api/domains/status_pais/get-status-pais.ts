import type { Value_StatusPais as valueStatusPais } from '@/generated'
import { prisma } from '@/lib/prisma'

export type StatusPais = {
  id: valueStatusPais
  statusPais: string
}

export async function getStatusPais() {
  const statusPais: StatusPais[] = await prisma.domainStatusPais.findMany({
    select: {
      id: true,
      statusPais: true,
    },
  })

  return statusPais
}
