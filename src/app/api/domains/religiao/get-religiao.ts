import type { Value_Religiao as valueReligiao } from '@/enums'
import { prisma } from '@/lib/prisma'

export type Religiao = {
  id: valueReligiao
  religiao: string
}

export async function getReligiao() {
  const religiao: Religiao[] = await prisma.domainReligiao.findMany({
    select: {
      id: true,
      religiao: true,
    },
  })

  return religiao
}
