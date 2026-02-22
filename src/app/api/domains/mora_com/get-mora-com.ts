import type { Value_MoraCom as valueMoraCom } from '@/enums'
import { prisma } from '@/lib/prisma'

export type MoraCom = {
  id: valueMoraCom
  moraCom: string
}

export async function getMoraCom() {
  const moraCom: MoraCom[] = await prisma.domainMoraCom.findMany({
    select: {
      id: true,
      moraCom: true,
    },
  })

  return moraCom
}
