import { prisma } from '@/lib/prisma'

export async function getEncontreiro(id: string) {
  const encontreiro = await prisma.pessoa.findUnique({
    where: {
      id,
    },
  })

  return encontreiro
}
