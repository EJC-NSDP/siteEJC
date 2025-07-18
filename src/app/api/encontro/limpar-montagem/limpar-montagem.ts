import { prisma } from '@/lib/prisma'

export async function limparMontagem() {
  return await prisma.equipeMontagem.deleteMany()
}
