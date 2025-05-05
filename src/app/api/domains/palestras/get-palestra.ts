import { prisma } from '@/lib/prisma'

export type Palestra = {
  id: number
  nome: string
}

export async function getPalestra() {
  const palestra: Palestra[] = await prisma.domainPalestras.findMany({
    select: {
      id: true,
      nome: true,
    },
  })

  return palestra
}
