import { prisma } from '@/lib/prisma'

export async function limparCartas() {
  return await prisma.carta.deleteMany()
}
