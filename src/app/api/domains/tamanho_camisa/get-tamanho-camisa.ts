import type { Value_TamanhoCamisa as valueTamanhoCamisa } from '@/generated'
import { prisma } from '@/lib/prisma'

export type TamanhoCamisa = {
  id: valueTamanhoCamisa
  tamanhoCamisa: string
}

export async function getTamanhoCamisa() {
  const tamanhoCamisa: TamanhoCamisa[] =
    await prisma.domainTamanhoCamisa.findMany({
      select: {
        id: true,
        tamanhoCamisa: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

  return tamanhoCamisa
}
